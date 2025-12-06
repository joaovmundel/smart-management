import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TitleService } from '@smart-management/layout';
import { ProductService } from '@smart-management/shared';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'sm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [
    ProductTableComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ProductListComponent implements OnInit {
  private readonly _productService = inject(ProductService);
  private readonly _title = inject(TitleService);
  private readonly _router = inject(Router);

  products: Product[] = [];

  ngOnInit() {
    this._title.setTitle('Produtos');
    this.loadProducts();
  }

  loadProducts(): void {
    this.products = this._productService.products;
  }

  goToCreateProduct() {
    this._router.navigate(['/stock/products/new']);
  }

  onEditProduct(product: Product) {
    this._router.navigate([`/stock/products/edit/${product.id}`]);
  }

  onDeleteProduct(productId: string) {
    this._productService.removeProduct(productId);
    this.loadProducts();
  }
}
