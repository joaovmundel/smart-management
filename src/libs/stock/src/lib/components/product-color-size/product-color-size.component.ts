import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { NgxColorsModule } from 'ngx-colors';

@Component({
  selector: 'sm-product-color-size',
  templateUrl: './product-color-size.component.html',
  styleUrls: ['./product-color-size.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    NgxColorsModule
  ],
})
export class ProductColorSizeComponent {
  leftColor = '#ff0000';

  addColor(): void {
    console.log('Add color');
  }
}
