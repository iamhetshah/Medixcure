import { Component, effect } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import {
  AppointmentResponse,
  MedicinesResponse,
  PrescriptionResponse,
} from '../../models/models';
import { formatDate } from '../../utils/utils';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  protected myMedicines: MedicinesResponse[] = [];
  protected myAppointments: AppointmentResponse[] = [];
  protected myPrescriptions: PrescriptionResponse[] = [];
  public selectedPrescription: PrescriptionResponse | undefined;

  isModalPrescriptionOpen: boolean = false;

  constructor(public auth: AuthService, private dataService: DataService) {
    effect(() => {
      this.myMedicines = this.dataService.getMyMedicines();
      this.myAppointments = this.dataService.getMyAppointments();
      this.myPrescriptions = this.dataService.getMyPrescriptions();
    });
  }

  openPrescriptionModal() {
    this.isModalPrescriptionOpen = true;
  }

  closePrescriptionModal() {
    this.isModalPrescriptionOpen = false;
  }

  // Map time of day to numerical order for sorting
  frequencyOrder = {
    Morning: 1,
    Afternoon: 2,
    Evening: 3,
    Night: 4,
  };

  removeAppointment($index: number) {
    this.myAppointments.splice($index, 1);
  }
}
