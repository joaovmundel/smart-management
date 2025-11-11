import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  recentSales: RecentSale[];
  topProducts: TopProduct[];
  salesTrend: SalesTrendData[];
}

export interface RecentSale {
  id: number;
  customerName?: string;
  totalAmount: number;
  createdAt: string;
}

export interface TopProduct {
  id: number;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  currentStock: number;
  minimumStock: number;
}

export interface SalesTrendData {
  date: string;
  amount: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiService) {}

  /**
   * Obter estatísticas do dashboard
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.apiService.get<DashboardStats>('/dashboard/stats');
  }

  /**
   * Obter vendas recentes
   */
  getRecentSales(limit = 10): Observable<RecentSale[]> {
    return this.apiService.get<RecentSale[]>(`/dashboard/recent-sales?limit=${limit}`);
  }

  /**
   * Obter produtos mais vendidos
   */
  getTopProducts(limit = 10): Observable<TopProduct[]> {
    return this.apiService.get<TopProduct[]>(`/dashboard/top-products?limit=${limit}`);
  }

  /**
   * Obter tendência de vendas
   */
  getSalesTrend(period: 'week' | 'month' | 'year' = 'week'): Observable<SalesTrendData[]> {
    return this.apiService.get<SalesTrendData[]>(`/dashboard/sales-trend?period=${period}`);
  }

  /**
   * Obter produtos com estoque baixo
   */
  getLowStockProducts(threshold = 10): Observable<LowStockProduct[]> {
    return this.apiService.get<LowStockProduct[]>(`/dashboard/low-stock?threshold=${threshold}`);
  }
}