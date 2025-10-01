import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'sm-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.scss'],
  standalone: true,
  imports: [ProductFormComponent, CommonModule],
})
export class ProductCreationComponent {
  // Removido isLoading e timeout artificial que podem estar causando problemas de renderização
  
  onSave() {
    console.log('Product saved:');
  }
  onCancel() {
    console.log('Product creation cancelled');
  }
}
