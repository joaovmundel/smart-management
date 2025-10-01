import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '@smart-management/layout';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'sm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [ProductFormComponent, CommonModule],
})
export class ProductListComponent implements OnInit {
  private readonly _title = inject(TitleService);

  ngOnInit() {
    this._title.setTitle('Produtos');
  }

  onSave(product: Product) {
    console.log('Product saved:', product);
  }

  onCancel() {
    console.log('Product creation cancelled');
  }
}
