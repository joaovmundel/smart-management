import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { StockService } from 'src/libs/stock/src/lib/services/stock.service';
import { PaymentMethod, Sale } from '@smart-management/stock';
import { mergePreservingValues } from '../utils/object.utils';

export interface SalesSummary {
  totalSales: number;
  totalAmount: number;
  averageTicket: number;
  period: string;
}

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  get sales(): Sale[] {
    return JSON.parse(localStorage.getItem('sales') || '[]');
  }

  private readonly _userService = inject(UserService);
  private readonly _stockService = inject(StockService);

  listSales(): Sale[] {
    return this.sales.filter(
      (sale) => sale.companyId === this._userService.getCurrentUser().companyId
    );
  }

  createSale(sale: Sale): string[] {
    const canMakeTheSale = this.canMakeTheSale(sale);
    if (canMakeTheSale.length === 0) {
      const currentSales = this.sales;
      sale.id = crypto.randomUUID();
      sale.saleCode = this.generateSaleCode();
      sale.companyId = this._userService.getCurrentUser().companyId!;
      sale.createdAt = new Date().toISOString();
      currentSales.push(sale);
      localStorage.setItem('sales', JSON.stringify(currentSales));
      
      // Só atualiza estoque se a venda estiver concluída
      if (sale.status === 'completed') {
        this.updateStockAfterSale(sale);
      }
    }
    return canMakeTheSale;
  }

  editSale(updatedSale: Sale): void {
    const currentSales = this.sales;
    const index = currentSales.findIndex((sale) => sale.id === updatedSale.id);
    if (index !== -1) {
      const existingSale = currentSales[index];
      
      // Gerenciar estoque baseado nas mudanças de status
      const wasCompleted = existingSale.status === 'completed';
      const isCompleted = updatedSale.status === 'completed';
      
      if (wasCompleted && !isCompleted) {
        // Status mudou de completed para pending/cancelled - devolver ao estoque
        this.revertStockAfterSale(existingSale);
      } else if (!wasCompleted && isCompleted) {
        // Status mudou de pending/cancelled para completed - remover do estoque
        this.updateStockAfterSale(updatedSale);
      } else if (wasCompleted && isCompleted) {
        // Ambos completed - reverter e aplicar novamente (caso itens tenham mudado)
        this.revertStockAfterSale(existingSale);
        this.updateStockAfterSale(updatedSale);
      }
      // Se ambos pending ou cancelled - não faz nada no estoque
      
      currentSales[index] = mergePreservingValues(existingSale, {
        ...updatedSale,
        updatedAt: new Date().toISOString(),
      });
      localStorage.setItem('sales', JSON.stringify(currentSales));
    }
  }

  private revertStockAfterSale(sale: Sale): void {
    for (const item of sale.items) {
      const stockedProduct = this._stockService.findStockedProductById(
        item.product.id.toString()
      );
      if (stockedProduct) {
        try {
          // Adicionar de volta ao estoque a quantidade vendida
          this._stockService.addToStock(item.product.id, item.quantity);
        } catch (error) {
          console.error(
            `Erro ao reverter o estoque para o produto ID ${item.product.id}:`,
            error
          );
        }
      }
    }
  }

  private generateSaleCode(): string {
    const companySales = this.listSales();
    const nextNumber = companySales.length + 1;
    return `S-${nextNumber.toString().padStart(4, '0')}`;
  }

  deleteSale(saleId: string): void {
    const currentSales = this.sales;
    const saleToDelete = currentSales.find((sale) => sale.id === saleId);
    
    // Reverter o estoque antes de deletar, mas só se a venda estava concluída
    if (saleToDelete && saleToDelete.status === 'completed') {
      this.revertStockAfterSale(saleToDelete);
    }
    
    const updatedSales = currentSales.filter((sale) => sale.id !== saleId);
    localStorage.setItem('sales', JSON.stringify(updatedSales));
  }

  canMakeTheSale(sale: Sale): string[] {
    const insufficientStockProducts: string[] = [];
    for (const item of sale.items) {
      const stockedProduct = this._stockService.findStockedProductById(
        item.product.id.toString()
      );
      if (!stockedProduct || stockedProduct.currentAmount! < item.quantity) {
        insufficientStockProducts.push(item.product.name);
      }
    }
    return insufficientStockProducts;
  }

  private updateStockAfterSale(sale: Sale): void {
    for (const item of sale.items) {
      const stockedProduct = this._stockService.findStockedProductById(
        item.product.id.toString()
      );
      if (stockedProduct) {
        try {
          this._stockService.removeFromStock(item.product.id, item.quantity);
        } catch (error) {
          console.error(
            `Erro ao atualizar o estoque para o produto ID ${item.product.id}:`,
            error
          );
        }
      }
    }
  }
}
