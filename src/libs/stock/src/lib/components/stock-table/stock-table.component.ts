import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IStockedProduct } from '../../models/stock.model';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { Router } from '@angular/router';
import { TitleService } from '@smart-management/layout';

@Component({
  selector: 'sm-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule,
    MatProgressBarModule,
  ],
})
export class StockTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() products: IStockedProduct[] = [];
  @Output() editProduct = new EventEmitter<IStockedProduct>();
  @Output() deleteProduct = new EventEmitter<string>();

  private readonly _dialog = inject(MatDialog);
  private readonly _router = inject(Router);
  private readonly _titleService = inject(TitleService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<IStockedProduct>();

  displayedColumns: string[] = [
    'photoUrl',
    'name',
    'totalSales',
    'minAmount',
    'maxAmount',
    'stockedValue',
    'potentialProfit',
    'currentAmount',
    'actions',
  ];

  searchTerm = '';

  ngOnInit(): void {
    this.updateDataSource();
    this._titleService.setTitle('Estoque');
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    // Configurar o filtro customizado para buscar apenas no nome do produto
    this.dataSource.filterPredicate = (
      data: IStockedProduct,
      filter: string
    ) => {
      const productName = data.name?.toLowerCase() || '';
      return productName.includes(filter);
    };
  }

  ngOnChanges(): void {
    this.updateDataSource();
    this.applyFilter();
  }

  private updateDataSource(): void {
    const enrichedProducts = this.products.map((product) => {
      const level = this.calculateStockLevel(product);
      return {
        ...product,
        stockLevel: level,
        progressColor: this.mapLevelToColor(level),
        progressPercentage: (product.currentAmount * 100) / product.maxAmount,
      };
    });

    this.dataSource.data = enrichedProducts;
  }

  private calculateStockLevel(
    product: IStockedProduct
  ): 'critical' | 'attention' | 'recommended' | 'excess' {
    const { currentAmount, minAmount, maxAmount } = product;
    const range = maxAmount - minAmount;
    const attentionThreshold = minAmount + range * 0.3;

    if (currentAmount <= minAmount) {
      return 'critical';
    } else if (currentAmount <= attentionThreshold) {
      return 'attention';
    } else if (currentAmount <= maxAmount) {
      return 'recommended';
    } else {
      return 'critical';
    }
  }

  private mapLevelToColor(level: string): 'warn' | 'accent' | 'primary' {
    if (level === 'critical') {
      return 'warn';
    } else if (level === 'attention') {
      return 'accent';
    } else {
      return 'primary';
    }
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  onEdit(product: IStockedProduct): void {
    this.editProduct.emit(product);
  }

  onDelete(stockedProduct: IStockedProduct): void {
    const dialogRef = this._dialog.open(DeleteConfirmationModalComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o produto "${stockedProduct?.name}"?`,
        item: stockedProduct,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProduct.emit(stockedProduct.id);
      }
    });
  }

  goToStockForm(): void {
    this._router.navigate(['/stock/create']);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
