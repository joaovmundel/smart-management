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
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'sm-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
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

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    // Inicializar o formulário no constructor para garantir que esteja disponível imediatamente
    this.initializeForm();
  }

  ngOnInit(): void {
    // Reinicializar no OnInit para considerar os inputs que podem ter mudado
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: [this.product?.name || '', [Validators.required]],
      description: [this.product?.description || ''],
      photoUrl: [this.product?.photoUrl || ''],
      grossValue: [
        this.product?.grossValue ?? 0,
        [Validators.required, Validators.min(0)],
      ],
      saleValue: [
        this.product?.saleValue ?? 0,
        [Validators.required, Validators.min(0)],
      ],
      categoryId: [this.product?.category?.id || '', [Validators.required]],
    });
  }

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.form.valid) {
      const formValue = this.form.value;
      const selectedCategory = this.categories.find(c => c.id === formValue.categoryId);
      
      const product: Product = {
        id: this.product?.id || this.generateId(),
        name: formValue.name,
        description: formValue.description,
        photoUrl: formValue.photoUrl,
        grossValue: formValue.grossValue,
        saleValue: formValue.saleValue,
        category: selectedCategory || this.categories[0],
        createdAt: this.product?.createdAt || new Date(),
        updatedAt: new Date(),
      };
      this.save.emit(product);
    } else {
      this.form.markAllAsTouched();
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  nextStep(): void {
    //TODO: Remove this line and implement step logic in parent component
    this.save.emit(this.form.value);
  }

  onCancel() {
    this.cancelForm.emit();
  }

  openCategoryModal(): void {
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      width: '600px',
      disableClose: true,
      data: { categories: this.categories }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'save') {
          this.categories = result.categories;
        } else if (result.action === 'delete') {
          this.confirmDeleteCategory(result.category);
        }
      }
    });
  }

  private confirmDeleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '400px',
      data: { category }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.categories = this.categories.filter(c => c.id !== category.id);
        // Se a categoria deletada estava selecionada, limpar a seleção
        if (this.form.get('categoryId')?.value === category.id) {
          this.form.get('categoryId')?.setValue('');
        }
      }
      // Reabrir o modal de categorias após a confirmação
      this.openCategoryModal();
    });
  }
}
