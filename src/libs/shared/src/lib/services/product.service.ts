import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category?: string;
  barcode?: string;
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
  providedIn: 'root'
})
export class ProductService {

  constructor(private apiService: ApiService) {}

  /**
   * Listar todos os produtos
   */
  getProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>('/products');
  }

  /**
   * Obter produto por ID
   */
  getProduct(id: number): Observable<Product> {
    return this.apiService.get<Product>(`/products/${id}`);
  }

  /**
   * Criar novo produto
   */
  createProduct(productData: CreateProductRequest): Observable<Product> {
    return this.apiService.post<Product>('/products', productData);
  }

  /**
   * Atualizar produto
   */
  updateProduct(id: number, productData: UpdateProductRequest): Observable<Product> {
    return this.apiService.put<Product>(`/products/${id}`, productData);
  }

  /**
   * Deletar produto
   */
  deleteProduct(id: number): Observable<void> {
    return this.apiService.delete<void>(`/products/${id}`);
  }

  /**
   * Obter movimentações de estoque
   */
  getStockMovements(productId?: number): Observable<StockMovement[]> {
    const endpoint = productId ? `/stock/movements?productId=${productId}` : '/stock/movements';
    return this.apiService.get<StockMovement[]>(endpoint);
  }

  /**
   * Registrar entrada de estoque
   */
  stockIn(productId: number, quantity: number, reason?: string): Observable<StockMovement> {
    return this.apiService.post<StockMovement>('/stock/in', {
      productId,
      quantity,
      reason
    });
  }

  /**
   * Registrar saída de estoque
   */
  stockOut(productId: number, quantity: number, reason?: string): Observable<StockMovement> {
    return this.apiService.post<StockMovement>('/stock/out', {
      productId,
      quantity,
      reason
    });
  }
}