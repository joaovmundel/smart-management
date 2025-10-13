import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { StockTableComponent } from '../../components/stock-table/stock-table.component';
import { IStockedProduct } from '../../models/stock.model';
import { stockedProductsMock } from '../../mocks/product.mock';

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
  ],
})
export class StockComponent {
  products: IStockedProduct[] = stockedProductsMock;

  isFormExpanded = false;

  onToggleForm() {
    this.isFormExpanded = !this.isFormExpanded;
  }

  onEditProduct(product: IStockedProduct) {
    // Lógica para editar o produto
    console.log('Editar produto:', product);
  }

  onDeleteProduct(productId: string) {
    // Lógica para deletar o produto
    console.log('Deletar produto com ID:', productId);
  }
}
