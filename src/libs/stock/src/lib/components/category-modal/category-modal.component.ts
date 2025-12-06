import { Component, OnInit, Inject, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '@smart-management/shared';
import { Category } from '../../models/category.model';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'sm-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatListModule,
    MatTooltipModule,
  ],
})
export class CategoryModalComponent implements OnInit {
  private readonly _productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  
  categoryForm!: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[] }
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  private loadCategories(): void {
    this.categories = this._productService.listCategories();
  }

  onCreateCategory(): void {
    if (this.categoryForm.valid) {
      const newCategory: Category = {
        id: this.generateId(),
        name: this.categoryForm.value.name,
        description: this.categoryForm.value.description,
        companyId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this._productService.createCategory(newCategory);
      this.loadCategories();
      this.categoryForm.reset();
      this.cdr.detectChanges();
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  onDeleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir a categoria "${category.name}"?`,
        item: category
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._productService.deleteCategory(category.id);
        this.loadCategories();
      }
    });
  }

  onSave(): void {
    this.dialogRef.close({ action: 'save' });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  trackByCategory(index: number, category: Category): string {
    return category.id;
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}