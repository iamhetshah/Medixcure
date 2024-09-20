import {
  Component,
  effect,
  EventEmitter,
  Input,
  Output,
  Signal,
  signal,
} from '@angular/core';
import { formatDate } from '../../utils/utils';
import { PrescriptionResponse } from '../../models/models';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-prescription-modal',
  templateUrl: './prescription-modal.component.html',
  styleUrl: './prescription-modal.component.css',
})
export class PrescriptionModalComponent {
  @Input('isOpen') isModalPrescriptionOpen!: boolean;
  @Input('prescription') prescription!: Signal<
    PrescriptionResponse | undefined
  >;

  protected filteredPres: PrescriptionResponse | undefined;
  protected query = signal('');

  @Output('close') close = new EventEmitter();

  constructor(protected auth: AuthService) {
    effect(() => {
      const q = this.query();
      if (this.prescription()) {
        this.filteredPres = {
          ...this.prescription()!,
          medicines: this.prescription()!.medicines.filter((ele) => {
            return ele.medicine_name.toLowerCase().includes(q.toLowerCase());
          }),
        };
      }
    });
  }

  formatDate0(date: Date | string) {
    date = new Date(date);
    return formatDate(date);
  }

  checkIfIn(obj: string, list: string[]) {
    var x;
    for (x of list) {
      if (x.toLowerCase() == obj.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  closePrescriptionModal() {
    this.isModalPrescriptionOpen = false;
    this.close.emit();
  }
}
