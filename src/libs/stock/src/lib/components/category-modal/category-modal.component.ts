import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  categoryForm!: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
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
        const index = this.categories.findIndex(c => c.id === category.id);
        if (index !== -1) {
          this.categories.splice(index, 1);
        }
      }
    });
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