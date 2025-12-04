import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TitleService } from '@smart-management/layout';
import { SalesTableComponent } from '../../components/sales-table/sales-table.component';
import { SaleDetailsModalComponent } from '../../components/sale-details-modal/sale-details-modal.component';
import { DeleteConfirmationModalComponent } from '../../components/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sale, SaleWithMetrics } from '../../models/sale.model';
import { salesMock } from '../../mocks/sales.mock';

@Component({
  selector: 'sm-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, SalesTableComponent],
})
export class SalesListComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _title = inject(TitleService);
  private readonly _dialog = inject(MatDialog);

  sales: Sale[] = [...salesMock];

  ngOnInit(): void {
    this._title.setTitle('Vendas');
  }

  goToCreateSale(): void {
    this._router.navigate(['/sales/new']);
  }

  goToDashboard(): void {
    this._router.navigate(['/sales/dashboard']);
  }

  onEditSale(sale: SaleWithMetrics): void {
    this._router.navigate(['/sales/edit', sale.id]);
  }

  onDeleteSale(saleId: string): void {
    const sale = this.sales.find(s => s.id === saleId);
    if (!sale) return;

    const dialogRef = this._dialog.open(DeleteConfirmationModalComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir a venda #${sale.id}${sale.customerName ? ` do cliente "${sale.customerName}"` : ''}?`,
        item: sale,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sales = this.sales.filter((s) => s.id !== saleId);
      }
    });
  }

  onViewSale(sale: SaleWithMetrics): void {
    this._dialog.open(SaleDetailsModalComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: sale,
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
