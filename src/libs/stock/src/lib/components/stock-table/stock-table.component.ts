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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<IStockedProduct>();

  displayedColumns: string[] = [
    'photo',
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

  ngOnInit() {
    this.updateDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    this.updateDataSource();
    this.applyFilter();
  }

  private updateDataSource() {
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

  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  onSearch() {
    this.applyFilter();
  }

  onEdit(product: IStockedProduct) {
    this.editProduct.emit(product);
  }

  onDelete(stockedProduct: IStockedProduct) {
    const dialogRef = this._dialog.open(DeleteConfirmationModalComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o produto "${stockedProduct?.product?.name}"?`,
        item: stockedProduct,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProduct.emit(stockedProduct.product.id);
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
