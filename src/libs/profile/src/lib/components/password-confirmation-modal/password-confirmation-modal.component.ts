import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-password-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './password-confirmation-modal.component.html',
  styleUrls: ['./password-confirmation-modal.component.scss'],
})
export class PasswordConfirmationModalComponent {
  private readonly _dialogRef = inject(MatDialogRef<PasswordConfirmationModalComponent>);
  private readonly _fb = inject(FormBuilder);

  passwordForm: FormGroup;
  hidePassword = true;

  constructor() {
    this.passwordForm = this._fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  confirm(): void {
    if (this.passwordForm.valid) {
      this._dialogRef.close({
        confirmed: true,
        password: this.passwordForm.get('currentPassword')?.value,
      });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this._dialogRef.close({ confirmed: false });
  }
}
