import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'sm-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class StockFormComponent {
  private formBuilder = inject(FormBuilder);

  stockForm!: FormGroup;

  constructor() {
    this.stockForm = this.formBuilder.group({
      product: new FormControl(''),
      currentAmount: new FormControl(0),
      minAmount: new FormControl(0),
      maxAmount: new FormControl(0),
      totalSales: new FormControl(0),
    });
  }

  onSubmit(): void {
    console.log(this.stockForm.value);
  }
}
