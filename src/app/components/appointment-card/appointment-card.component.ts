import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppointmentResponse } from '../../models/models';
import { AuthService } from '../../services/auth/auth.service';
import { convertSeconds, secondsRemaining } from '../../utils/utils';
import { HttpClient } from '@angular/common/http';
import { constants } from '../../../../constants';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-appointment-card',
  templateUrl: './appointment-card.component.html',
  styleUrl: './appointment-card.component.css',
})
export class AppointmentCardComponent {
  @Input('appointment') appointment!: AppointmentResponse;
  @Output('removeMe') removeMe: EventEmitter<any> = new EventEmitter();
  @Output('open') open = new EventEmitter();
  protected cancelled: boolean = false;
  constructor(
    protected auth: AuthService,
    private http: HttpClient,
    private data: DataService
  ) {}
  timeRemaining(date: Date | string) {
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

  format_Date(d: string) {
    const date = new Date(d);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} @ ${hours}:${minutes}`;
  }

  cancel_booking() {
    const data = {
      book_id: this.appointment.book_slot_id,
    };

    this.http
      .post<any>(constants.BASE_URL + 'cancel_book_slot/', data)
      .subscribe({
        next: (res) => {
          if (
            res.message ===
            'Booking canceled and appointment history removed successfully.'
          ) {
            this.removeMe.emit();
            this.data.reload();
          }
        },
      });
  }
}
