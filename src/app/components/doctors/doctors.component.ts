import { Component, effect } from '@angular/core';
import { DoctorsResponse } from '../../models/models';
import { DataService } from '../../services/data/data.service';
import { constants } from '../../../../constants';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css',
})
export class DoctorsComponent {
  selectedDoctor: DoctorsResponse | undefined = undefined;
  protected doctors: DoctorsResponse[] = [];
  constructor(private data: DataService) {
    window.onclick = (event) => {
      const modal = document.getElementById('modal');
      if (event.target === modal) {
        this.closeModal();
      }
    };

    effect(() => {
      this.doctors = this.data.getDoctors({
        q: '',
        categories: [],
      })();
    });
  }
  openModal() {
    document.getElementById('modal')?.classList.remove('hidden');
  }

  closeModal() {
    document.getElementById('modal')?.classList.add('hidden');
  }

  fromMidnight(seconds: number | Date): string {
    console.log(seconds);

    if (typeof seconds === 'number') {
      const totalMinutes = Math.floor(seconds / 60);
      const hours24 = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      // Convert 24-hour format to 12-hour format
      const period = hours24 >= 12 ? 'PM' : 'AM';
      const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

      // Format hours and minutes with leading zero if necessary
      const formattedHours = hours12.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');

      return `${formattedHours}:${formattedMinutes}${period}`;
    }
    return '';
  }

  defaultImageDoctor(img: string | null | undefined) {
    if (img) {
      return constants.HOST + img;
    } else {
      return constants.DEFAULT_DOCTOR_IMAGE;
    }
  }

  defaultImageHospital(img: string | null | undefined) {
    if (img) {
      return constants.HOST + img;
    } else {
      return constants.DEFAULT_HOSPITAL_IMAGE;
    }
  }
}
