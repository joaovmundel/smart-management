import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../models/category.model';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  categoryForm!: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[] }
  ) {
    this.categories = [...data.categories];
  }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  onCreateCategory(): void {
    if (this.categoryForm.valid) {
      const newCategory: Category = {
        id: this.generateId(),
        name: this.categoryForm.value.name,
        description: this.categoryForm.value.description,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.categories.push(newCategory);
      this.categoryForm.reset();
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  onDeleteCategory(category: Category): void {
    // Emit event to parent to handle confirmation dialog
    this.dialogRef.close({ action: 'delete', category });
  }

  onSave(): void {
    this.dialogRef.close({ action: 'save', categories: this.categories });
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