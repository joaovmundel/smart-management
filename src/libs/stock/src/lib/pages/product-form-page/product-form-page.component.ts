import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TitleService } from '@smart-management/layout';
import { CategoryModalComponent } from '../../components/category-modal/category-modal.component';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'sm-product-form-page',
  templateUrl: './product-form-page.component.html',
  styleUrls: ['./product-form-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
})
export class ProductFormPageComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _destroy$ = new Subject<void>();
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _title = inject(TitleService);
  private readonly _dialog = inject(MatDialog);

  productForm!: FormGroup;
  isInvalidForm = true;

  // Mock categories - em produção, isso viria de um serviço
  categories: Category[] = [
    {
      id: '1',
      name: 'Eletrônicos',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Roupas',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Casa e Jardim',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      name: 'Esportes',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  ngOnInit(): void {
    this._title.setTitle('Formulário de produto');
    this.initForm();
    this.listenFormChanges();
  }

  private initForm(): void {
    this.productForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      photoUrl: [''],
      grossValue: [0, [Validators.required, Validators.min(0)]],
      saleValue: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', [Validators.required]],
    }, { validators: this.saleValueValidator });
  }

  private saleValueValidator(form: FormGroup) {
    const grossValue = form.get('grossValue')?.value;
    const saleValue = form.get('saleValue')?.value;

    if (grossValue && saleValue && saleValue <= grossValue) {
      return { saleValueInvalid: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const selectedCategory = this.categories.find(c => c.id === formValue.categoryId);
      
      const product: Product = {
        id: this.generateId(),
        name: formValue.name,
        description: formValue.description,
        photoUrl: formValue.photoUrl,
        grossValue: formValue.grossValue,
        saleValue: formValue.saleValue,
        category: selectedCategory || this.categories[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Product created:', product);

      this._snackBar.open('Produto criado com sucesso!', 'Fechar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      // Navegar de volta para a lista de produtos
      this.backToProductList();
    } else {
      this.markFormGroupTouched();
      this._snackBar.open('Por favor, preencha todos os campos obrigatórios.', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  resetForm(): void {
    this.productForm.reset({
      name: '',
      description: '',
      photoUrl: '',
      grossValue: 0,
      saleValue: 0,
      categoryId: ''
    });

    Object.values(this.productForm.controls).forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();
      control.setErrors(null);
    });
    this.isInvalidForm = true;
  }

  private listenFormChanges(): void {
    this.productForm.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.isInvalidForm = this.productForm.invalid;
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo é obrigatório';
    }

    if (control?.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }

    if (control?.hasError('min')) {
      const minValue = control.getError('min').min;
      return `O valor mínimo é ${minValue}`;
    }

    if (controlName === 'saleValue' && this.productForm.hasError('saleValueInvalid')) {
      return 'O preço de venda deve ser maior que o preço de custo';
    }

    return '';
  }

  getProductMargin(): number {
    const grossValue = this.productForm.get('grossValue')?.value || 0;
    const saleValue = this.productForm.get('saleValue')?.value || 0;
    return saleValue - grossValue;
  }

  getMarginPercentage(): number {
    const grossValue = this.productForm.get('grossValue')?.value || 0;
    const margin = this.getProductMargin();
    return grossValue > 0 ? (margin / grossValue) * 100 : 0;
  }

  backToProductList(): void {
    this._router.navigate(['/stock/products']);
  }

  openCategoryModal(): void {
    const dialogRef = this._dialog.open(CategoryModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { categories: this.categories },
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === 'save') {
        const currentCategoryId = this.productForm.get('categoryId')?.value;
        this.categories = result.categories;
        
        // Se a categoria selecionada foi deletada, limpar o campo
        if (currentCategoryId && !this.categories.find(c => c.id === currentCategoryId)) {
          this.productForm.patchValue({ categoryId: '' });
        }

        this._snackBar.open('Categorias atualizadas com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}