import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.css',
})
export class ToggleSwitchComponent {
  protected isYes: boolean = false;
  @Output('toggle') toggle = new EventEmitter<boolean>();

  emit() {
    this.toggle.emit(this.isYes);
  }
}
