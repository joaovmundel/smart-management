import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@smart-management/shared';

@Component({
  selector: 'app-user-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './user-details-modal.component.html',
  styleUrls: ['./user-details-modal.component.scss'],
})
export class UserDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatPhone(phone: string | undefined): string {
    if (!phone) return 'Não informado';
    // Remove non-digits
    const cleaned = phone.replace(/\D/g, '');
    // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  }
}