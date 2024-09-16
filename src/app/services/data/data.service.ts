import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  AppointmentResponse,
  DoctorsRequest,
  DoctorsResponse,
  MedicinesResponse,
  PrescriptionResponse,
} from '../../models/models';
import { constants } from '../../../../constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private myMedicines = signal<MedicinesResponse[]>([]);
  private myAppointments = signal<AppointmentResponse[]>([]);
  private myPrescriptions = signal<PrescriptionResponse[]>([]);
  private doctors = signal<DoctorsResponse[]>([]);
  constructor(private http: HttpClient) {
    this.getMedicines();
    this.getAppointments();
    this.getPrescriptions();
    this.getDoctors0({
      q: '',
      categories: [],
    });
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

  public getDoctors(data: DoctorsRequest) {
    return this.doctors.asReadonly();
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
      });
  }

  private getAppointments() {
    this.http
      .get<{ appointments: AppointmentResponse[] }>(
        constants.BASE_URL + 'get_appointments'
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
      });
  }

  private getPrescriptions() {
    this.http
      .get<{ prescriptions: PrescriptionResponse[] }>(
        constants.BASE_URL + 'get_prescriptions'
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
      });
  }
}
