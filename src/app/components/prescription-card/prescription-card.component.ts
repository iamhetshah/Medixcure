import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PrescriptionResponse } from '../../models/models';
import { formatDate } from '../../utils/utils';

@Component({
  selector: 'app-prescription-card',
  templateUrl: './prescription-card.component.html',
  styleUrl: './prescription-card.component.css',
})
export class PrescriptionCardComponent {
  // Modal State
  @Input('prescription') prescription!: PrescriptionResponse;
  @Output('selectPrescription') selectPrescription: EventEmitter<any> =
    new EventEmitter();
  isModalOpen: boolean = false;

  formatDate(date: Date | string) {
    date = new Date(date);
    return formatDate(date);
  }
}
