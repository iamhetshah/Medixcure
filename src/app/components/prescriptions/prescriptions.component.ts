import {
  AfterViewInit,
  Component,
  effect,
  EventEmitter,
  Input,
  Output,
  Signal,
  signal,
} from '@angular/core';
import {
  AppointmentResponse,
  MedicationMaster,
  Prescribe,
  PrescriptionResponse,
} from '../../models/models';
import { formatDate } from '../../utils/utils';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { constants } from '../../../../constants';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.css',
})
export class PrescriptionsComponent {
  @Input('isOpen') isModalPrescriptionOpen!: boolean;
  @Input('appointment') appointment!: Signal<AppointmentResponse | undefined>;
  @Output('close') close = new EventEmitter();

  protected prescriptionMap: Map<number, Prescribe> = new Map();

  protected query = signal('');
  protected suggestions = signal<MedicationMaster[]>([]);

  protected isFocused: boolean = false;

  constructor(
    protected auth: AuthService,
    protected http: HttpClient,
    private data: DataService
  ) {
    effect(() => {
      const appo = this.appointment();

      if (appo) {
        if (!this.prescriptionMap.has(appo.book_slot_id)) {
          this.prescriptionMap.set(appo.book_slot_id, {
            book_id: appo.book_slot_id,
            note: '',
            medicines: [],
          });
        }
      }

      console.log(this.prescriptionMap);
    });
  }

  addMedicine(med: MedicationMaster) {
    this.suggestions.set([]);
    this.prescriptionMap.get(this.appointment()!.book_slot_id)!.medicines.push({
      name: med.name,
      medicine_id: med.id,
      dosage: '',
      empty_stomach: true,
      frequency: {
        morning: true,
        afternoon: true,
        evening: true,
        night: true,
      },
    });
  }

  changeVal(re: any, val: boolean, dt: number) {
    switch (dt) {
      case 0:
        re.frequency.morning = val;
        break;
      case 1:
        re.frequency.afternoon = val;
        break;
      case 2:
        re.frequency.evening = val;
        break;
      case 3:
        re.frequency.night = val;
        break;
      case 4:
        re.empty_stomach = val;
        break;
    }
  }

  fetchSuggestions() {
    this.query.update((old) => old.trim());
    if (this.query() && this.query().length > 0) {
      this.http
        .post<{ meds: MedicationMaster[] }>(constants.BASE_URL + 'get_meds/', {
          q: this.query(),
        })
        .subscribe({
          next: (res) => {
            this.suggestions.set(res.meds);
          },
        });
    } else {
      this.suggestions.set([]);
    }
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

  savePrescription() {
    const p = this.prescriptionMap.get(this.appointment()!.book_slot_id);

    this.http.post(constants.BASE_URL + 'add_prescription/', p).subscribe({
      next: (res) => {
        this.data.reload();
        this.closePrescriptionModal();
      },
    });
  }
}
