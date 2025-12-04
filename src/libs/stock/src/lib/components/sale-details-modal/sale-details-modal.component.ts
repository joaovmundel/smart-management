import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { SaleItem, SaleStatus, SaleWithMetrics, PaymentMethod } from '../../models/sale.model';

@Component({
  selector: 'sm-sale-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
  ],
  templateUrl: './sale-details-modal.component.html',
  styleUrls: ['./sale-details-modal.component.scss'],
})
export class SaleDetailsModalComponent {
  private readonly _router = inject(Router);

  displayedColumns: string[] = ['product', 'quantity', 'unitPrice', 'discount', 'subtotal'];

  constructor(
    public dialogRef: MatDialogRef<SaleDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public sale: SaleWithMetrics
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    this.dialogRef.close();
    this._router.navigate(['/sales/edit', this.sale.id]);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  getStatusLabel(status: SaleStatus): string {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    switch (method) {
      case 'pix':
        return 'PIX';
      case 'credit':
        return 'Cartão de crédito';
      case 'debit':
        return 'Cartão de débito';
      case 'cash':
        return 'Dinheiro';
      case 'bank-slip':
        return 'Boleto';
      default:
        return method;
    }
  }

  getStatusClass(status: SaleStatus): string {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  calculateSubtotal(item: SaleItem): number {
    const gross = item.quantity * item.unitPrice;
    const discount = item.discount ?? 0;
    return gross - discount;
  }
}
