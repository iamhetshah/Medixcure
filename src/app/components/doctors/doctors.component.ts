import {
  Component,
  computed,
  effect,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { AppointmentSlot, DoctorsResponse } from '../../models/models';
import { DataService } from '../../services/data/data.service';
import { constants } from '../../../../constants';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css',
})
export class DoctorsComponent {
  @ViewChild('date') date!: ElementRef;
  selectedDoctor: DoctorsResponse | undefined = undefined;
  protected doctors: DoctorsResponse[] = [];
  protected specialities: string[] = [];
  protected selectedSlot: AppointmentSlot | undefined;
  protected query = signal('');
  private formCategories: Array<{ name: string; value: string }> = [];
  protected cateogriesGroup: FormGroup;
  protected newslot: boolean = false;
  constructor(
    private data: DataService,
    private fb: FormBuilder,
    private http: HttpClient,
    protected auth: AuthService
  ) {
    this.cateogriesGroup = this.fb.group({
      categories: new FormArray([]),
    });

    window.onclick = (event) => {
      const modal = document.getElementById('modal');
      if (event.target === modal) {
        this.closeModal();
      }
    };

    effect(() => {
      this.doctors = this.data.doctors();
      this.specialities = this.data.getSpecialities();
      for (let s of this.specialities) {
        this.formCategories.push({
          name: s,
          value: s,
        });
      }
    });

    effect(() => {
      const query = this.query();
      this.data.updateDoctors({
        q: query,
        specialities: this.cateogriesGroup.value.categories,
      });
    });
  }
  openModal() {
    document.getElementById('modal')?.classList.remove('hidden');
  }

  closeModal() {
    document.getElementById('modal')?.classList.add('hidden');
    this.selectedSlot = undefined;
    this.selectedDoctor = undefined;
  }

  onCheckboxChange(e: any) {
    const categories: FormArray = this.cateogriesGroup.get(
      'categories'
    ) as FormArray;

    if (e.target.checked) {
      categories.push(new FormControl(e.target.value));
    } else {
      const index = categories.controls.findIndex(
        (x) => x.value === e.target.value
      );
      categories.removeAt(index);
    }

    this.data.updateDoctors({
      q: this.query(),
      specialities: this.cateogriesGroup.value.categories,
    });
  }

  fromMidnight(seconds: number | Date): string {
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

  bookSlot() {
    function getDateTime(dateString: string, seconds: number) {
      const date = new Date(dateString + 'T00:00:00');
      date.setSeconds(date.getSeconds() + seconds);

      return date;
    }
    const data = {
      appointment_slot_id: this.selectedSlot?.id,
      doctor_id: this.selectedDoctor?.doctor.doctor_id,
      start_time: getDateTime(
        this.date.nativeElement.value,
        this.selectedSlot?.start_time!
      ).toISOString(),
      booked_at: new Date().toISOString(),
    };

    this.http.post(constants.BASE_URL + 'book_slot/', data).subscribe({
      next: (data) => {
        this.closeModal();
        this.data.reload();
      },
    });
  }

  removeSlot(slot: AppointmentSlot) {
    this.http.get(constants.BASE_URL + '');
  }

  addSlot(hours: number, minutes: number, price: number) {
    const start_time = hours * 3600 + minutes * 60;
    console.log(start_time, price);
    this.http
      .post(constants.BASE_URL + 'add_appointment_slot/', {
        start_time,
        price,
      })
      .subscribe({
        next: (req) => {
          this.closeModal();
          this.data.reload();
        },
      });
  }
}
