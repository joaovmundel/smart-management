import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Category } from '@smart-management/stock';

export interface Product {
  id: string;
  name: string;
  description?: string;
  costPrice: number;
  salePrice: number;
  categoryId: string;
  photoUrl?: string;
  companyId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category?: string;
  barcode?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  category?: string;
  barcode?: string;
}

export interface StockMovement {
  id: number;
  productId: number;
  type: 'IN' | 'OUT';
  quantity: number;
  reason?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  get products(): Product[] {
    return JSON.parse(localStorage.getItem('products') || '[]');
  }

  get categories(): Category[] {
    return JSON.parse(localStorage.getItem('categories') || '[]');
  }

  private readonly _userService = inject(UserService);

  listProducts(): Product[] {
    return this.products.filter(
      (p) => p.companyId === this._userService.getCurrentUser()?.companyId
    );
  }

  addProduct(product: Product): void {
    let products = this.products;
    product.companyId = this._userService.getCurrentUser()?.companyId || '';
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
  }

  removeProduct(productId: string): void {
    let products = this.products;
    products = products.filter((p) => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));
  }

  updateProduct(productId: string, updatedData: Product): void {
    let products = this.products;
    updatedData.companyId = this._userService.getCurrentUser()?.companyId || '';
    products = products.map((p) =>
      p.id === productId
        ? { ...p, ...updatedData, updatedAt: new Date().toISOString() }
        : p
    );
    localStorage.setItem('products', JSON.stringify(products));
  }

  findProductById(productId: string): Product | undefined {
    return this.products.find(
      (p) =>
        p.id === productId &&
        p.companyId === this._userService.getCurrentUser()?.companyId
    );
  }

  findCategoryById(categoryId: string): Category | undefined {
    return this.categories.find(
      (c) =>
        c.id === categoryId &&
        c.companyId === this._userService.getCurrentUser()?.companyId
    );
  }

  listCategories(): Category[] {
    return this.categories.filter(
      (c) => c.companyId === this._userService.getCurrentUser()?.companyId
    );
  }

  findCategoryByCompanyId(companyId: string): Category[] {
    return this.categories.filter(
      (c) => c.companyId === this._userService.getCurrentUser()?.companyId
    );
  }

  createCategory(category: Category): void {
    let categories = this.categories;
    category.companyId = this._userService.getCurrentUser()?.companyId || '';
    categories.push(category);
    localStorage.setItem('categories', JSON.stringify(categories));
  }

  deleteCategory(categoryId: string): void {
    let categories = this.categories;
    categories = categories.filter((c) => c.id !== categoryId);
    localStorage.setItem('categories', JSON.stringify(categories));
  }
}
