import { Component, effect } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import {
  AppointmentResponse,
  MedicinesResponse,
  PrescriptionResponse,
} from '../../models/models';
import {
  convertSeconds,
  formatDate,
  secondsRemaining,
} from '../../utils/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  protected myMedicines: MedicinesResponse[] = [];
  protected myAppointments: AppointmentResponse[] = [];
  protected myPrescriptions: PrescriptionResponse[] = [];
  constructor(private dataService: DataService) {
    effect(() => {
      this.myMedicines = this.dataService.getMyMedicines();
      this.myAppointments = this.dataService.getMyAppointments();
      this.myPrescriptions = this.dataService.getMyPrescriptions();
    });
  }

  timeRemaining(date: Date | string) {
    console.log(date);

    date = new Date(date);
    const remaining = convertSeconds(secondsRemaining(date));

    let res = '';

    if (remaining.days > 0) {
      res += remaining.days + (remaining.days > 1 ? ' days ' : ' day ');
    }

    if (remaining.hours > 0) {
      res += remaining.hours + (remaining.hours > 1 ? ' hours ' : ' hour ');
    }

    if (remaining.minutes > 0) {
      res +=
        remaining.minutes + (remaining.minutes > 1 ? ' minutes' : ' minute');
    }

    return 'In ' + res;
  }

  formatDate(date: Date | string) {
    date = new Date(date);
    return formatDate(date);
  }
  // Map time of day to numerical order for sorting
  frequencyOrder = {
    Morning: 1,
    Afternoon: 2,
    Evening: 3,
    Night: 4,
  };
}
