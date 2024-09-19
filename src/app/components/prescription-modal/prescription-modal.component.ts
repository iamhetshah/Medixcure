import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formatDate } from '../../utils/utils';
import { PrescriptionResponse } from '../../models/models';

@Component({
  selector: 'app-prescription-modal',
  templateUrl: './prescription-modal.component.html',
  styleUrl: './prescription-modal.component.css',
})
export class PrescriptionModalComponent {
  @Input('isOpen') isModalPrescriptionOpen!: boolean;
  @Input('prescription') prescription!: PrescriptionResponse | undefined;

  @Output('close') close = new EventEmitter();
  @Output('open') open = new EventEmitter();

  formatDate0(date: Date | string) {
    date = new Date(date);
    return formatDate(date);
  }

  checkIfIn(obj: string, list: string[]) {
    var x;
    for (x of list) {
      console.log(obj);
      if (x.toLowerCase() == obj.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  openPrescriptionModal() {
    this.isModalPrescriptionOpen = true;
    this.open.emit();
  }

  closePrescriptionModal() {
    this.isModalPrescriptionOpen = false;
    this.close.emit();
  }
}
