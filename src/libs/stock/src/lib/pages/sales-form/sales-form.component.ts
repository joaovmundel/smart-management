import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TitleService } from '@smart-management/layout';
import { ProductService, SalesService, UserService } from '@smart-management/shared';
import { StockService } from '../../services/stock.service';
import { PaymentMethod, Sale, SaleItem, SaleStatus } from '../../models/sale.model';
import { Product } from '../../models/product.model';

type SaleItemFormValue = {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
};

@Component({
  selector: 'sm-sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.scss'],
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
  ],
})
export class SalesFormComponent implements OnInit, OnDestroy {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _title = inject(TitleService);
  private readonly _salesService = inject(SalesService);
  private readonly _productService = inject(ProductService);
  private readonly _stockService = inject(StockService);
  private readonly _userService = inject(UserService);
  private readonly _destroy$ = new Subject<void>();

  isEditMode = false;
  saleId: string | null = null;
  existingSale?: Sale;

  products: Product[] = [];
  paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'pix', label: 'PIX' },
    { value: 'credit', label: 'Cartão de crédito' },
    { value: 'debit', label: 'Cartão de débito' },
    { value: 'cash', label: 'Dinheiro' },
    { value: 'bank-slip', label: 'Boleto' },
  ];
  statuses: { value: SaleStatus; label: string }[] = [
    { value: 'completed', label: 'Concluída' },
    { value: 'pending', label: 'Pendente' },
    { value: 'cancelled', label: 'Cancelada' },
  ];

  saleForm!: FormGroup;
  totals = {
    totalGross: 0,
    totalDiscount: 0,
    totalNet: 0,
    totalUnits: 0,
  };

  ngOnInit(): void {
    this.loadProducts();
    
    // Detectar se estamos no modo de edição
    this.saleId = this._route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.saleId;
    
    // Definir título da página baseado no modo
    const title = this.isEditMode ? 'Editar venda' : 'Registrar venda';
    this._title.setTitle(title);
    
    this.initForm();
    this.listenChanges();
    this.calculateTotals();
    
    // Se estiver no modo de edição, carregar dados da venda
    if (this.isEditMode) {
      this.loadSaleData();
    }
  }

  private loadProducts(): void {
    const stockedProducts = this._stockService.listStockedProducts();
    this.products = stockedProducts.map(sp => ({
      ...sp,
      category: this._productService.findCategoryById(sp.categoryId)
    })) as Product[];
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  get items(): FormArray {
    return this.saleForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    if (this.items.length === 1) {
      return;
    }
    this.items.removeAt(index);
    this.calculateTotals();
  }

  onProductSelected(index: number): void {
    const itemGroup = this.items.at(index) as FormGroup;
    const productId = itemGroup.get('productId')?.value;
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      itemGroup.patchValue({ unitPrice: product.salePrice }, { emitEvent: false });
      this.calculateTotals();
    }
  }

  onSubmit(): void {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      this._snackBar.open('Preencha os dados da venda corretamente.', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    const sale = this.buildSale();

    try {
      if (this.isEditMode && this.existingSale) {
        this._salesService.editSale(sale);
        this._snackBar.open('Venda atualizada com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      } else {
        const insufficientProducts = this._salesService.createSale(sale);
        
        if (insufficientProducts.length > 0) {
          this._snackBar.open(
            `Estoque insuficiente para: ${insufficientProducts.join(', ')}`,
            'Fechar',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
          return;
        }
        
        this._snackBar.open('Venda registrada com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      }
      
      this.backToSalesList();
    } catch (error) {
      this._snackBar.open(
        (error as Error).message || 'Erro ao salvar venda',
        'Fechar',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
    }
  }

  backToSalesList(): void {
    this._router.navigate(['/sales']);
  }

  addNewProduct(): void {
    this._router.navigate(['/stock/products/new']);
  }

  private loadSaleData(): void {
    if (!this.saleId) return;
    
    const sales = this._salesService.listSales();
    const sale = sales.find(s => s.id === this.saleId);
    
    if (!sale) {
      this._snackBar.open('Venda não encontrada', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      this.backToSalesList();
      return;
    }
    
    this.existingSale = sale;
    
    // Preencher formulário com dados da venda
    this.saleForm.patchValue({
      customerName: sale.customerName || '',
      saleDate: sale.saleDate,
      paymentMethod: sale.paymentMethod,
      status: sale.status,
      notes: sale.notes || '',
    });
    
    // Limpar items e adicionar os da venda
    this.items.clear();
    sale.items.forEach(item => {
      const itemGroup = this._fb.group({
        productId: [item.product.id, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        unitPrice: [item.unitPrice, [Validators.required, Validators.min(0)]],
        discount: [item.discount || 0, [Validators.min(0)]],
      });
      this.items.push(itemGroup);
    });
    
    this.calculateTotals();
  }

  resetForm(): void {
    this.saleForm.reset({
      customerName: '',
      saleDate: new Date(),
      paymentMethod: 'pix',
      status: 'completed',
      notes: '',
    });
    this.items.clear();
    this.items.push(this.createItemGroup());
    this.calculateTotals();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  }

  private initForm(): void {
    this.saleForm = this._fb.group({
      customerName: [''],
      saleDate: [new Date(), Validators.required],
      paymentMethod: ['pix', Validators.required],
      status: ['completed', Validators.required],
      notes: [''],
      items: this._fb.array([this.createItemGroup()]),
    });
  }

  private createItemGroup(): FormGroup {
    return this._fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0)]],
    });
  }

  private listenChanges(): void {
    this.saleForm.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.calculateTotals();
    });
  }

  private calculateTotals(): void {
    const snapshot = this.items.controls.map(
      (control) => control.value as SaleItemFormValue
    );

    const aggregate = snapshot.reduce(
      (acc, item) => {
        const product = this.products.find((p) => p.id === item.productId);
        const price = item.unitPrice || product?.salePrice || 0;
        const quantity = item.quantity || 0;
        const discount = item.discount || 0;
        acc.totalGross += price * quantity;
        acc.totalDiscount += discount;
        acc.totalNet += price * quantity - discount;
        acc.totalUnits += quantity;
        return acc;
      },
      { totalGross: 0, totalDiscount: 0, totalNet: 0, totalUnits: 0 }
    );

    this.totals = aggregate;
  }

  private buildSale(): Sale {
    const value = this.saleForm.getRawValue();

    const items: SaleItem[] = (value.items as SaleItemFormValue[]).map((item) => {
      const product = this.products.find((p) => p.id === item.productId);
      return {
        product: product as Product,
        quantity: item.quantity,
        unitPrice: item.unitPrice || product?.salePrice || 0,
        discount: item.discount || 0,
      };
    });

    return {
      id: this.isEditMode && this.existingSale ? this.existingSale.id : '',
      saleCode: this.existingSale?.saleCode,
      saleDate: value.saleDate,
      paymentMethod: value.paymentMethod,
      status: value.status,
      customerName: value.customerName,
      notes: value.notes,
      companyId: this._userService.getCurrentUser()?.companyId,
      createdAt: this.existingSale?.createdAt,
      items,
    };
  }
}
