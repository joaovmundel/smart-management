import { Component, EventEmitter, Input, Output, inject, ViewChild, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'sm-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
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
  ],
})
export class ProductTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() products: Product[] = [];
  @Output() editProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<string>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  private readonly _dialog = inject(MatDialog);
  
  dataSource = new MatTableDataSource<Product>();
  displayedColumns: string[] = ['photo', 'name', 'description', 'category', 'saleValue', 'grossValue', 'actions'];
  searchTerm = '';

  ngOnInit() {
    this.dataSource.data = this.products;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    this.dataSource.data = this.products;
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  onSearch() {
    this.applyFilter();
  }

  onEdit(product: Product) {
    this.editProduct.emit(product);
  }

  onDelete(product: Product) {
    const dialogRef = this._dialog.open(DeleteConfirmationModalComponent, {
      width: '400px',
      data: { 
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o produto "${product.name}"?`,
        item: product
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct.emit(product.id);
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}