import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Sale {
  id: number;
  totalAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  customerId?: number;
  customerName?: string;
  createdAt: string;
  updatedAt?: string;
  items: SaleItem[];
}

export interface SaleItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateSaleRequest {
  customerId?: number;
  customerName?: string;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface SalesSummary {
  totalSales: number;
  totalAmount: number;
  averageTicket: number;
  period: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private apiService: ApiService) {}

  /**
   * Listar todas as vendas
   */
  getSales(): Observable<Sale[]> {
    return this.apiService.get<Sale[]>('/sales');
  }

  /**
   * Obter venda por ID
   */
  getSale(id: number): Observable<Sale> {
    return this.apiService.get<Sale>(`/sales/${id}`);
  }

  /**
   * Criar nova venda
   */
  createSale(saleData: CreateSaleRequest): Observable<Sale> {
    return this.apiService.post<Sale>('/sales', saleData);
  }

  /**
   * Atualizar status da venda
   */
  updateSaleStatus(id: number, status: 'PENDING' | 'COMPLETED' | 'CANCELLED'): Observable<Sale> {
    return this.apiService.put<Sale>(`/sales/${id}/status`, { status });
  }

  /**
   * Deletar venda
   */
  deleteSale(id: number): Observable<void> {
    return this.apiService.delete<void>(`/sales/${id}`);
  }

  /**
   * Obter resumo de vendas
   */
  getSalesSummary(period?: string): Observable<SalesSummary> {
    const endpoint = period ? `/sales/summary?period=${period}` : '/sales/summary';
    return this.apiService.get<SalesSummary>(endpoint);
  }

  /**
   * Obter vendas por período
   */
  getSalesByPeriod(startDate: string, endDate: string): Observable<Sale[]> {
    return this.apiService.get<Sale[]>(`/sales?startDate=${startDate}&endDate=${endDate}`);
  }
}