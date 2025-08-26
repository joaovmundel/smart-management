import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class ConfirmationModalComponent {
  private dialogRef: MatDialogRef<ConfirmationModalComponent> = inject(
    MatDialogRef<ConfirmationModalComponent>
  );

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
