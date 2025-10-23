import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { StockTableComponent } from '../../components/stock-table/stock-table.component';
import { SimpleInfoCardComponent } from '../../components/simple-info-card/simple-info-card.component';
import { stockedProductsMock } from '../../mocks/product.mock';
import { IStockedProduct } from '../../models/stock.model';
import { Router } from '@angular/router';

@Component({
  selector: 'sm-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    StockTableComponent,
    InfoCardComponent,
    SimpleInfoCardComponent,
  ],
})
export class StockComponent implements OnInit {
  private readonly _router = inject(Router);

  products: IStockedProduct[] = stockedProductsMock;
  isSmallScreen = false;

  stockedValue = 0;
  potentialProfit = 0;
  criticalProducts = 0;
  attentionProducts = 0;
  excessProducts = 0;
  totalProducts = 0;

  stockInfo = [];

  ngOnInit(): void {
    this.calculateTotals();
    this.loadStockInfoValues();
  }

  calculateTotals(): void {
    for (const stockedProduct of this.products) {
      const range = stockedProduct.maxAmount - stockedProduct.minAmount;
      const attentionThreshold = stockedProduct.minAmount + range * 0.3;

      this.stockedValue += stockedProduct.stockedValue ?? 0;
      this.potentialProfit += stockedProduct.potentialProfit ?? 0;

      this.totalProducts += stockedProduct.currentAmount;
      if (stockedProduct.currentAmount <= stockedProduct.minAmount) {
        this.criticalProducts++;
      }

      if (
        stockedProduct.currentAmount <= attentionThreshold &&
        stockedProduct.currentAmount > stockedProduct.minAmount
      ) {
        this.attentionProducts++;
      }

      if (stockedProduct.currentAmount > stockedProduct.maxAmount) {
        this.excessProducts++;
      }
    }
  }

  loadStockInfoValues(): void {
    this.stockInfo = [
      {
        label: 'Produtos em estado de atenção',
        value: this.attentionProducts,
        color: '#ffc107',
      },
      {
        label: 'Produtos em estado crítico',
        value: this.criticalProducts,
        color: '#f44336',
      },
      {
        label: 'Produtos em excesso',
        value: this.excessProducts,
        color: '#2196f3',
      },
      {
        label: 'Produtos estocados',
        value: this.totalProducts,
        color: 'green',
      },
    ] as never;
  }


  onEditProduct(stockedProduct: IStockedProduct): void {
    // Lógica para editar o produto
    console.log('Editar produto:', stockedProduct);
    this._router.navigate(['/stock/edit', stockedProduct.product?.id]);
  }

  onDeleteProduct(productId: string): void {
    // Lógica para deletar o produto
    console.log('Deletar produto com ID:', productId);
  }
}
