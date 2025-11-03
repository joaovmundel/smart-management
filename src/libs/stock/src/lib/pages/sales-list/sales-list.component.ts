import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TitleService } from '@smart-management/layout';
import { SalesTableComponent } from '../../components/sales-table/sales-table.component';
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
    this.sales = this.sales.filter((sale) => sale.id !== saleId);
  }

  onViewSale(sale: SaleWithMetrics): void {
    console.log('Visualizar venda', sale);
  }
}
