import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal } from '@angular/core';
import {
  AppointmentResponse,
  DoctorsRequest,
  DoctorsResponse,
  MedicinesResponse,
  PrescriptionResponse,
} from '../../models/models';
import { constants } from '../../../../constants';
import { map } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private myMedicines = signal<MedicinesResponse[]>([]);
  private myAppointments = signal<AppointmentResponse[]>([]);
  private myPrescriptions = signal<PrescriptionResponse[]>([]);
  public doctors = signal<DoctorsResponse[]>([]);
  private specialities = signal<string[]>([]);
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {
    effect(() => {
      const a = this.auth.isAuthenticatedSignal();
      if (a()) {
        this.reload();
      }
    });
    this.reload();
  }

  public get getMyMedicines() {
    return this.myMedicines.asReadonly();
  }

  public get getMyAppointments() {
    return this.myAppointments.asReadonly();
  }

  public get getMyPrescriptions() {
    return this.myPrescriptions.asReadonly();
  }

  public getDoctors() {
    return this.doctors.asReadonly();
  }

  public updateDoctors(data: DoctorsRequest) {
    this.getDoctors0(data);
  }

  public get getSpecialities() {
    return this.specialities.asReadonly();
  }

  public reload() {
    this.getMedicines();
    this.getUpcomingAppointments();
    this.getPrescriptions();
    this.getSpecialities0();
    this.updateDoctors({
      q: '',
      specialities: [],
    });
  }

  private getDoctors0(data: DoctorsRequest) {
    this.http
      .post<{ doctors: DoctorsResponse[] }>(
        constants.BASE_URL + 'search_doctors/',
        data
      )
      .subscribe({
        next: (res) => {
          this.doctors.set(res.doctors);
        },
        error: (err) => {
          if (err.status === 401) {
            this.auth.removeAuthData();
            this.router.navigate(['/login']);
          }
        },
      });
  }

  private getSpecialities0() {
    this.http
      .get<{ specialities: string[] }>(
        constants.BASE_URL + 'get_specializations'
      )
      .subscribe({
        next: (res) => {
          this.specialities.set(res.specialities);
        },
        error: (err) => {
          if (err.status === 401) {
            this.auth.removeAuthData();
            this.router.navigate(['/login']);
          }
        },
      });
  }

  private getMedicines() {
    this.http
      .get<{ prescription_details: MedicinesResponse[] }>(
        constants.BASE_URL + 'get_user_prescription'
      )
      .subscribe({
        next: (response) => {
          this.myMedicines.set(response.prescription_details);
        },
        error: (err) => {
          if (err.status === 401) {
            this.auth.removeAuthData();
            this.router.navigate(['/login']);
          }
        },
      });
  }

  private getUpcomingAppointments() {
    this.http
      .get<{ appointments: AppointmentResponse[] }>(
        constants.BASE_URL + 'get_upcoming_appointments/'
      )
      .pipe(
        map((res: { appointments: AppointmentResponse[] }) => {
          for (let a of res.appointments) {
            a.appointment_slot.start_time = new Date(
              a.appointment_slot.start_time + ' UTC'
            );
          }
          return res;
        })
      )
      .subscribe({
        next: (res) => {
          this.myAppointments.set(res.appointments);
        },
        error: (err) => {
          if (err.status === 401) {
            this.auth.removeAuthData();
            this.router.navigate(['/login']);
          }
        },
      });
  }

  private getPrescriptions() {
    this.http
      .post<{ prescriptions: PrescriptionResponse[] }>(
        constants.BASE_URL + 'get_prescriptions/',
        {}
      )
      .pipe(
        map((res: { prescriptions: PrescriptionResponse[] }) => {
          for (let p of res.prescriptions) {
            p.date = new Date(p.date);
          }

          return res;
        })
      )
      .subscribe({
        next: (res) => {
          this.myPrescriptions.set(res.prescriptions);
        },
        error: (err) => {
          if (err.status === 401) {
            this.auth.removeAuthData();
            this.router.navigate(['/login']);
          }
        },
      });
  }
}
