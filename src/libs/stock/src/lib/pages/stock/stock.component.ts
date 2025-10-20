import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { StockTableComponent } from '../../components/stock-table/stock-table.component';
import { SimpleInfoCardComponent } from '../../components/simple-info-card/simple-info-card.component';
import { stockedProductsMock } from '../../mocks/product.mock';
import { IStockedProduct } from '../../models/stock.model';

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
  products: IStockedProduct[] = stockedProductsMock;

  stockedValue = 0;
  potentialProfit = 0;
  criticalProducts = 0;
  attentionProducts = 0;
  excessProducts = 0;
  totalProducts = 0;

  isFormExpanded = false;

  ngOnInit(): void {
    this.calculateTotals();
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

      if (stockedProduct.currentAmount <= attentionThreshold && stockedProduct.currentAmount > stockedProduct.minAmount) {
        this.attentionProducts++;
      }

      if (stockedProduct.currentAmount > stockedProduct.maxAmount) {
        this.excessProducts++;
      }
    }
  }

  onToggleForm(): void {
    this.isFormExpanded = !this.isFormExpanded;
  }

  onEditProduct(product: IStockedProduct): void {
    // Lógica para editar o produto
    console.log('Editar produto:', product);
  }

  onDeleteProduct(productId: string): void {
    // Lógica para deletar o produto
    console.log('Deletar produto com ID:', productId);
  }
}
