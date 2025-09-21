import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sm-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class ProductFormComponent implements OnInit {
  @Input() product?: Product;
  @Output() save = new EventEmitter<Product>();
  @Output() cancelForm = new EventEmitter<void>();

  form!: FormGroup;
  categories: Category[] = [
    {
      id: '1',
      name: 'Categoria 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Categoria 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.product?.name || '', [Validators.required]],
      description: [this.product?.description || ''],
      photoUrl: [this.product?.photoUrl || ''],
      stockAmount: [
        this.product?.stockAmount ?? 0,
        [Validators.required, Validators.min(0)],
      ],
      saleValue: [
        this.product?.saleValue ?? 0,
        [Validators.required, Validators.min(0)],
      ],
      grossValue: [
        this.product?.grossValue ?? 0,
        [Validators.required, Validators.min(0)],
      ],
      category: [this.product?.category || {}, [Validators.required]],
    });
  }

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.form.valid) {
      const formValue = this.form.value;
      const product: Product = {
        ...this.product,
        ...formValue,
        id: this.product?.id || '',
        createdAt: this.product?.createdAt || new Date(),
        updatedAt: new Date(),
      };
      this.save.emit(product);
    } else {
      this.form.markAllAsTouched();
    }
  }

  nextStep(): void {
    //TODO: Remove this line and implement step logic in parent component
    this.save.emit(this.form.value);
  }

  onCancel() {
    this.cancelForm.emit();
  }
}
