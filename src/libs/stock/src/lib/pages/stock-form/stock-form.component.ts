import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product.model';
import { IStockedProductWithMetadata } from '../../models/stock.model';
import { TitleService } from '@smart-management/layout';
import { ProductService, UserService } from '@smart-management/shared';
import { StockService } from '../../services/stock.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'sm-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatAutocompleteModule,
    MatIconModule,
    MatSnackBarModule,
  ],
})
export class StockFormComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroy$ = new Subject<void>();
  private readonly _titleService = inject(TitleService);
  private readonly _stockService = inject(StockService);
  private readonly _productService = inject(ProductService);
  private readonly _userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  stockForm!: FormGroup;
  products: Product[] = [];
  filteredProducts!: Observable<Product[]>;
  isInvalidForm = true;
  isEditMode = false;
  productId: string | null = null;
  existingStockedProduct?: IStockedProductWithMetadata;

  ngOnInit(): void {
    this.loadProducts();
    this.initForm();
    this.checkEditMode();
    this.setupProductFilter();
    this.listenFormChanges();
  }

  private loadProducts(): void {
    this.products = this._productService.products
      .filter(
        (p) => p.companyId === this._userService.getCurrentUser()?.companyId
      )
      .map((product) => ({
        ...product,
        category: this._productService.findCategoryById(product.categoryId) || {
          id: '',
          name: 'Sem Categoria',
          description: '',
          companyId: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }));
  }

  private checkEditMode(): void {
    this.productId = this._route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this._titleService.setTitle('Editar Produto no Estoque');
      this.loadStockedProduct(this.productId);
    } else {
      this._titleService.setTitle('Adicionar Produto ao Estoque');
    }
  }

  private loadStockedProduct(productId: string): void {
    const stockedProduct = this._stockService.findStockedProductById(productId);

    if (stockedProduct) {
      this.existingStockedProduct = stockedProduct;
      const product = this._productService.findProductById(productId);

      // Adicionar categoria ao produto
      const productWithCategory = product
        ? {
            ...product,
            category: this._productService.findCategoryById(
              product.categoryId
            ) || {
              id: '',
              name: 'Sem Categoria',
              description: '',
              companyId: '',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          }
        : null;

      this.stockForm.patchValue({
        product: productWithCategory,
        currentAmount: stockedProduct.currentAmount,
        minAmount: stockedProduct.minAmount,
        maxAmount: stockedProduct.maxAmount,
        totalSales: stockedProduct.totalSales || 0,
      });

      // Desabilitar o campo de produto na edição
      this.stockForm.get('product')?.disable();
    } else {
      this.snackBar.open('Produto não encontrado no estoque', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      this.backToStockList();
    }
  }

  private initForm(): void {
    this.stockForm = this.formBuilder.group(
      {
        product: [null, [Validators.required]],
        currentAmount: [0, [Validators.required, Validators.min(0)]],
        minAmount: [0, [Validators.required, Validators.min(0)]],
        maxAmount: [0, [Validators.required, Validators.min(1)]],
        totalSales: [0, [Validators.min(0)]],
      },
      { validators: this.maxAmountValidator }
    );
  }

  private maxAmountValidator(form: FormGroup) {
    const minAmount = form.get('minAmount')?.value;
    const maxAmount = form.get('maxAmount')?.value;

    if (minAmount && maxAmount && maxAmount <= minAmount) {
      return { maxAmountInvalid: true };
    }
    return null;
  }

  private setupProductFilter(): void {
    const productControl = this.stockForm.get('product');
    if (productControl) {
      this.filteredProducts = productControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterProducts(value || ''))
      );
    }
  }

  private _filterProducts(value: string): Product[] {
    if (typeof value === 'object') {
      return this.products;
    }

    const filterValue = value.toLowerCase();
    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(filterValue) ||
        product.description?.toLowerCase().includes(filterValue)
    );
  }

  displayProduct(product: Product): string {
    return product ? product.name : '';
  }

  onSubmit(): void {
    if (
      this.stockForm.valid ||
      (this.isEditMode && this.stockForm.get('product')?.disabled)
    ) {
      const formValue = this.stockForm.getRawValue();
      const product = formValue.product as Product;

      try {
        if (this.isEditMode && this.existingStockedProduct) {
          const updatedStockedProduct: IStockedProductWithMetadata = {
            ...this.existingStockedProduct,
            currentAmount: formValue.currentAmount,
            minAmount: formValue.minAmount,
            maxAmount: formValue.maxAmount,
            totalSales: formValue.totalSales || 0,
            stockedValue: formValue.currentAmount * product.costPrice,
            potentialProfit:
              formValue.currentAmount * (product.salePrice - product.costPrice),
            updatedAt: new Date().toISOString(),
          };

          this._stockService.editProductInStock(updatedStockedProduct);

          this.snackBar.open(
            'Produto atualizado no estoque com sucesso!',
            'Fechar',
            {
              duration: 3000,
              panelClass: ['success-snackbar'],
            }
          );
        } else {
          const stockedProduct: IStockedProductWithMetadata = {
            ...product,
            currentAmount: formValue.currentAmount,
            minAmount: formValue.minAmount,
            maxAmount: formValue.maxAmount,
            totalSales: formValue.totalSales || 0,
            stockedValue: formValue.currentAmount * product.costPrice,
            potentialProfit:
              formValue.currentAmount * (product.salePrice - product.costPrice),
            companyId: this._userService.getCurrentUser()?.companyId || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          this._stockService.createStockedProduct(stockedProduct);

          this.snackBar.open(
            'Produto adicionado ao estoque com sucesso!',
            'Fechar',
            {
              duration: 3000,
              panelClass: ['success-snackbar'],
            }
          );
        }

        this.backToStockList();
      } catch (error) {
        this.snackBar.open(
          (error as Error).message || 'Erro ao salvar produto no estoque',
          'Fechar',
          {
            duration: 3000,
            panelClass: ['error-snackbar'],
          }
        );
      }
    } else {
      this.markFormGroupTouched();
      this.snackBar.open(
        'Por favor, preencha todos os campos obrigatórios.',
        'Fechar',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
    }
  }

  resetForm(): void {
    this.stockForm.reset({
      product: null,
      currentAmount: 0,
      minAmount: 0,
      maxAmount: 0,
      totalSales: 0,
    });

    Object.values(this.stockForm.controls).forEach((control) => {
      control.markAsPristine();
      control.markAsUntouched();
      control.setErrors(null);
    });
    this.isInvalidForm = true;
  }

  listenFormChanges(): void {
    this.stockForm.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((change) => {
        this.isInvalidForm = change?.product === null || this.stockForm.invalid;
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.stockForm.controls).forEach((key) => {
      const control = this.stockForm.get(key);
      control?.markAsTouched();
    });
  }

  isProductSelected(): boolean {
    const product = this.stockForm.get('product')?.value;
    return product && typeof product === 'object' && product.id;
  }

  getSelectedProduct(): (Product & { category: Category }) | null {
    const product = this.stockForm.get('product')?.value;
    return this.isProductSelected() ? product : null;
  }

  getProductMargin(): number {
    const product = this.getSelectedProduct();
    if (product) {
      return product.salePrice - product.costPrice;
    }
    return 0;
  }

  getErrorMessage(controlName: string): string {
    const control = this.stockForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo é obrigatório';
    }

    if (control?.hasError('min')) {
      const minValue = control.getError('min').min;
      return `O valor mínimo é ${minValue}`;
    }

    if (
      controlName === 'maxAmount' &&
      this.stockForm.hasError('maxAmountInvalid')
    ) {
      return 'A quantidade máxima deve ser maior que a mínima';
    }

    return '';
  }

  backToStockList(): void {
    this._router.navigate(['/stock']);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
