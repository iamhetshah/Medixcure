import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { PrescriptionResponse } from '../../models/models';
import { formatDate } from '../../utils/utils';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-prescription-card',
  templateUrl: './prescription-card.component.html',
  styleUrl: './prescription-card.component.css',
})
export class PrescriptionCardComponent {
  // Modal State
  @Input('prescription') prescription!: PrescriptionResponse | undefined;
  @Output('selectPrescription') selectPrescription: EventEmitter<any> =
    new EventEmitter();

  constructor(protected auth: AuthService) {}

  formatDate(date: Date | string) {
    date = new Date(date);
    return formatDate(date);
  }
}
