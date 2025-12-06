import { inject, Injectable } from '@angular/core';
import {
  mergePreservingValues,
  Product,
  UserService,
} from '@smart-management/shared';
import { IStockedProductWithMetadata } from '../models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  get stock(): IStockedProductWithMetadata[] {
    return JSON.parse(localStorage.getItem('stock') || '[]');
  }
  private readonly _userService = inject(UserService);

  existsInStock(productId: string): boolean {
    return this.stock.some((stockedProduct) => stockedProduct.id === productId);
  }

  listStockedProducts(): IStockedProductWithMetadata[] {
    return this.stock.filter(
      (stockedProduct) =>
        stockedProduct.companyId ===
        this._userService.getCurrentUser().companyId
    );
  }

  createStockedProduct(stockedProduct: IStockedProductWithMetadata): void {
    const currentStock = this.stock;
    if (!this.existsInStock(stockedProduct.id)) {
      currentStock.push(stockedProduct);
      localStorage.setItem('stock', JSON.stringify(currentStock));
    } else {
      throw new Error('Produto já existe no estoque.');
    }
  }

  deleteStockedProduct(productId: string): void {
    if (this.existsInStock(productId)) {
      const updatedStock = this.stock.filter(
        (stockedProduct) => stockedProduct.id !== productId
      );
      localStorage.setItem('stock', JSON.stringify(updatedStock));
    } else {
      throw new Error('Produto não encontrado no estoque.');
    }
  }

  editProductInStock(updatedProduct: Product): void {
    const stock = this.stock;
    const index = stock.findIndex(
      (stockedProduct) => stockedProduct.id === updatedProduct.id
    );
    if (index !== -1) {
      let stockedProduct = stock[index];

      stockedProduct = mergePreservingValues(stockedProduct, {
        ...updatedProduct,
        updatedAt: new Date().toISOString(),
      });
      stock[index] = stockedProduct;
      localStorage.setItem('stock', JSON.stringify(stock));
    } else {
      throw new Error('Produto não encontrado no estoque.');
    }
  }

  findStockedProductById(
    productId: string
  ): IStockedProductWithMetadata | undefined {
    return this.stock.find((sp) => sp.id === productId);
  }

  getStockedAmountByProductId(productId: string): number {
    const stockedProduct = this.findStockedProductById(productId);
    return stockedProduct ? stockedProduct.currentAmount : 0;
  }

  getMaxStockedAmountByProductId(productId: string): number {
    const stockedProduct = this.findStockedProductById(productId);
    return stockedProduct ? stockedProduct.maxAmount : 0;
  }

  getMinStockedAmountByProductId(productId: string): number {
    const stockedProduct = this.findStockedProductById(productId);
    return stockedProduct ? stockedProduct.minAmount : 0;
  }

  addToStock(productId: string, amountToAdd: number): void {
    if (amountToAdd <= 0) {
      throw new Error('A quantidade a ser adicionada deve ser maior que zero.');
    } else {
      if (this.existsInStock(productId)) {
        const stockedProduct = this.findStockedProductById(productId);
        stockedProduct!.currentAmount! += amountToAdd;
        this.editProductInStock(stockedProduct!);
      } else {
        throw new Error('Produto não encontrado no estoque.');
      }
    }
  }

  removeFromStock(productId: string, amountToRemove: number): void {
    if (amountToRemove <= 0) {
      throw new Error('A quantidade a ser removida deve ser maior que zero.');
    } else {
      if (this.existsInStock(productId)) {
        const stockedProduct = this.findStockedProductById(productId);
        if (stockedProduct!.currentAmount! >= amountToRemove) {
          stockedProduct!.currentAmount! -= amountToRemove;
          this.editProductInStock(stockedProduct!);
        } else {
          throw new Error('Quantidade insuficiente em estoque para remoção.');
        }
      } else {
        throw new Error('Produto não encontrado no estoque.');
      }
    }
  }
}
