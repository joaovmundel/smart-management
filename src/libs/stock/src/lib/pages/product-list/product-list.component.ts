import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TitleService } from '@smart-management/layout';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { Product } from '../../models/product.model';
import { productListMock } from '../../mocks/product.mock';

@Component({
  selector: 'sm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [ProductTableComponent, CommonModule, MatButtonModule, MatIconModule],
})
export class ProductListComponent implements OnInit {
  private readonly _title = inject(TitleService);
  private readonly _router = inject(Router);

  // Mock data - em produção, isso viria de um serviço
  products: Product[] = productListMock;

  ngOnInit() {
    this._title.setTitle('Produtos');
  }

  goToCreateProduct() {
    this._router.navigate(['/stock/products/new']);
  }

  onEditProduct(product: Product) {
    this._router.navigate([`/stock/products/edit/${product.id}`]);
  }

  onDeleteProduct(productId: string) {
    console.log('Deleting product:', productId);
    // Remover produto da lista
    this.products = this.products.filter(p => p.id !== productId);
  }
}
