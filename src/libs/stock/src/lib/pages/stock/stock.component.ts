/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { StockTableComponent } from '../../components/stock-table/stock-table.component';
import { SimpleInfoCardComponent } from '../../components/simple-info-card/simple-info-card.component';
import { IStockedProductWithMetadata } from '../../models/stock.model';
import { Router } from '@angular/router';
import { TitleService } from '@smart-management/layout';
import { StockService } from '../../services/stock.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'sm-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatSnackBarModule,
    StockTableComponent,
    InfoCardComponent,
    SimpleInfoCardComponent,
  ],
})
export class StockComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _titleService = inject(TitleService);
  private readonly _stockService = inject(StockService);
  private readonly _snackBar = inject(MatSnackBar);

  products: IStockedProductWithMetadata[] = [];
  isSmallScreen = false;

  stockedValue = 0;
  potentialProfit = 0;
  criticalProducts = 0;
  attentionProducts = 0;
  excessProducts = 0;
  totalProducts = 0;

  stockInfo = [];

  ngOnInit(): void {
    this.loadProducts();
    this.calculateTotals();
    this.loadStockInfoValues();
    this._titleService.setTitle('Estoque');
  }

  private loadProducts(): void {
    this.products = this._stockService.listStockedProducts();
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


  onEditProduct(stockedProduct: IStockedProductWithMetadata): void {
    this._router.navigate(['/stock/edit', stockedProduct.id]);
  }

  onDeleteProduct(productId: string): void {
    try {
      this._stockService.deleteStockedProduct(productId);
      this.loadProducts();
      this.resetTotals();
      this.calculateTotals();
      this.loadStockInfoValues();
      this._snackBar.open('Produto removido do estoque com sucesso!', 'Fechar', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
    } catch (error) {
      this._snackBar.open(
        (error as Error).message || 'Erro ao remover produto do estoque',
        'Fechar',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
    }
  }

  private resetTotals(): void {
    this.stockedValue = 0;
    this.potentialProfit = 0;
    this.criticalProducts = 0;
    this.attentionProducts = 0;
    this.excessProducts = 0;
    this.totalProducts = 0;
  }
}
