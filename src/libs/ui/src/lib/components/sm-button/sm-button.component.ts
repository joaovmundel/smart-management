import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sm-button',
  templateUrl: './sm-button.component.html',
  standalone: true,
})
export class SmButtonComponent {
  @Input() type: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Output() press = new EventEmitter<void>();

  onClick() {
    this.press.emit();
  }
}
