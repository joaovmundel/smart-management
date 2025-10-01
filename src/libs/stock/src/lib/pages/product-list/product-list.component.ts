import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TitleService } from '@smart-management/layout';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { Product } from '../../models/product.model';
import { productListMock } from '../../mocks/product.mock';

@Component({
  selector: 'sm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [ProductFormComponent, ProductTableComponent, CommonModule, MatExpansionModule, MatIconModule],
})
export class ProductListComponent implements OnInit {
  private readonly _title = inject(TitleService);

  // Mock data - em produção, isso viria de um serviço
  products: Product[] = productListMock;
  isFormExpanded = false;

  ngOnInit() {
    this._title.setTitle('Produtos');
  }

  onSave(product: Product) {
    console.log('Product saved:', product);
    // Adicionar o produto à lista (simulação)
    this.products = [...this.products, { ...product, id: Date.now().toString() }];
    // Recolher o painel após salvar
    this.isFormExpanded = false;
  }

  onCancel() {
    console.log('Product creation cancelled');
    // Recolher o painel ao cancelar
    this.isFormExpanded = false;
  }

  onToggleForm() {
    this.isFormExpanded = !this.isFormExpanded;
  }

  onEditProduct(product: Product) {
    console.log('Editing product:', product);
    // Implementar lógica de edição
  }

  onDeleteProduct(productId: string) {
    console.log('Deleting product:', productId);
    // Remover produto da lista
    this.products = this.products.filter(p => p.id !== productId);
  }
}
