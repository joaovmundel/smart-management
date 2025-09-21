import { Component } from '@angular/core';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ProductColorSizeComponent } from '../../components/product-color-size/product-color-size.component';

@Component({
  selector: 'sm-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.scss'],
  standalone: true,
  imports: [ProductFormComponent, ProductColorSizeComponent, CommonModule],
})
export class ProductCreationComponent {
  step = 1;
  maxSteps = 2;
  // Component logic goes here

  onSave(product: Product) {
    // Handle save action
    console.log('Product saved:', product);
  }
  onCancel() {
    // Handle cancel action
    console.log('Product creation cancelled');
  }

  nextStep(): void {
    if (this.step < this.maxSteps) {
      this.step++;
    }
  }

  previousStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }
}
