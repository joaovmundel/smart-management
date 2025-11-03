import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Sale, SaleWithMetrics } from '../../models/sale.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'sm-sales-table',
  templateUrl: './sales-table.component.html',
  styleUrls: ['./sales-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
})
export class SalesTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() sales: Sale[] = [];
  @Output() editSale = new EventEmitter<SaleWithMetrics>();
  @Output() deleteSale = new EventEmitter<string>();
  @Output() viewSale = new EventEmitter<SaleWithMetrics>();
  @Output() createSale = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<SaleWithMetrics>();

  displayedColumns: string[] = [
    'id',
    'saleDate',
    'customerName',
    'totalUnits',
    'totalNet',
    'status',
    'paymentMethod',
    'actions',
  ];

  searchTerm = '';

  ngOnInit(): void {
    this.updateDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: SaleWithMetrics, filter: string) => {
      const target = `${data.id} ${data.customerName ?? ''} ${data.items
        .map((item) => item.product.name)
        .join(' ')}`.toLowerCase();
      return target.includes(filter);
    };
  }

  ngOnChanges(): void {
    this.updateDataSource();
    this.applyFilter();
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  onSearch(): void {
    this.applyFilter();
  }

  onCreate(): void {
    this.createSale.emit();
  }

  onEdit(sale: SaleWithMetrics): void {
    this.editSale.emit(sale);
  }

  onDelete(id: string): void {
    this.deleteSale.emit(id);
  }

  onView(sale: SaleWithMetrics): void {
    this.viewSale.emit(sale);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  getStatusLabel(status: SaleWithMetrics['status']): string {
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

  getPaymentMethodLabel(method: SaleWithMetrics['paymentMethod']): string {
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

  getStatusClass(status: SaleWithMetrics['status']): string {
    if (status === 'completed') {
      return 'status-completed';
    }

    if (status === 'pending') {
      return 'status-pending';
    }

    return 'status-cancelled';
  }

  private updateDataSource(): void {
    const mapped = this.sales.map((sale) => this.calculateMetrics(sale));
    this.dataSource.data = mapped;
  }

  private calculateMetrics(sale: Sale): SaleWithMetrics {
    const totals = sale.items.reduce(
      (acc, item) => {
        const gross = item.quantity * item.unitPrice;
        const discount = item.discount ?? 0;
        acc.totalGross += gross;
        acc.totalDiscount += discount;
        acc.totalNet += gross - discount;
        acc.totalUnits += item.quantity;
        return acc;
      },
      { totalGross: 0, totalDiscount: 0, totalNet: 0, totalUnits: 0 }
    );

    return {
      ...sale,
      totalGross: totals.totalGross,
      totalDiscount: totals.totalDiscount,
      totalNet: totals.totalNet,
      totalUnits: totals.totalUnits,
    };
  }
}
