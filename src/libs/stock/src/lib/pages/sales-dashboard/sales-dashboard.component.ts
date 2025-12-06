import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TitleService } from '@smart-management/layout';
import { SalesService } from '@smart-management/shared';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { SimpleInfoCardComponent, SimpleInfoItem } from '../../components/simple-info-card/simple-info-card.component';
import { Sale, SaleWithMetrics } from '../../models/sale.model';

interface TopProductRow {
  productName: string;
  unitsSold: number;
  revenue: number;
  revenueShare: number;
}

interface RecentSaleRow {
  id: string;
  saleCode?: string;
  saleDate: Date;
  customerName?: string;
  totalNet: number;
  status: Sale['status'];
}

interface SummaryCard {
  title: string;
  value: string | number;
  icon: string;
  color: 'primary' | 'accent' | 'warn' | 'success' | 'info';
}

@Component({
  selector: 'sm-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    InfoCardComponent,
    SimpleInfoCardComponent,
  ],
})
export class SalesDashboardComponent implements OnInit {
  private readonly _title = inject(TitleService);
  private readonly _salesService = inject(SalesService);

  sales: Sale[] = [];
  salesWithMetrics: SaleWithMetrics[] = [];

  revenueTotal = 0;
  totalOrders = 0;
  averageTicket = 0;
  totalUnits = 0;

  topProducts: TopProductRow[] = [];
  recentSales: RecentSaleRow[] = [];
  statusBreakdown: SimpleInfoItem[] = [];
  paymentBreakdown: SimpleInfoItem[] = [];
  summaryCards: SummaryCard[] = [];

  ngOnInit(): void {
    this._title.setTitle('Dashboard de vendas');
    this.loadSales();
    this.salesWithMetrics = this.sales.map((sale) => this.enrichSale(sale));
    this.calculateSummary();
    this.calculateTopProducts();
    this.calculateRecentSales();
    this.calculateBreakdowns();
  }

  private loadSales(): void {
    this.sales = this._salesService.listSales();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  }

  getStatusLabel(status: Sale['status']): string {
    if (status === 'completed') {
      return 'Concluída';
    }
    if (status === 'pending') {
      return 'Pendente';
    }
    return 'Cancelada';
  }

  private enrichSale(sale: Sale): SaleWithMetrics {
    const totals = sale.items.reduce(
      (acc, item) => {
        const gross = item.unitPrice * item.quantity;
        const discount = item.discount ?? 0;
        acc.totalGross += gross;
        acc.totalDiscount += discount;
        acc.totalNet += gross - discount;
        acc.totalUnits += item.quantity;
        return acc;
      },
      { totalGross: 0, totalDiscount: 0, totalNet: 0, totalUnits: 0 }
    );

    return {
      ...sale,
      saleDate: typeof sale.saleDate === 'string' ? new Date(sale.saleDate) : sale.saleDate,
      totalGross: totals.totalGross,
      totalDiscount: totals.totalDiscount,
      totalNet: totals.totalNet,
      totalUnits: totals.totalUnits,
    };
  }

  private calculateSummary(): void {
    // Considerar apenas vendas concluídas para faturamento
    const completedSales = this.salesWithMetrics.filter(s => s.status === 'completed');
    
    const aggregate = completedSales.reduce(
      (acc, sale) => {
        acc.revenue += sale.totalNet;
        acc.units += sale.totalUnits;
        acc.orders += 1;
        return acc;
      },
      { revenue: 0, units: 0, orders: 0 }
    );

    this.revenueTotal = aggregate.revenue;
    this.totalUnits = aggregate.units;
    this.totalOrders = aggregate.orders;
    this.averageTicket = this.totalOrders > 0 ? this.revenueTotal / this.totalOrders : 0;

    this.summaryCards = [
      {
        title: 'Faturamento total',
        value: this.formatCurrency(this.revenueTotal),
        icon: 'payments',
        color: 'success',
      },
      {
        title: 'Pedidos concluídos',
        value: this.totalOrders,
        icon: 'shopping_bag',
        color: 'primary',
      },
      {
        title: 'Ticket médio',
        value: this.formatCurrency(this.averageTicket),
        icon: 'attach_money',
        color: 'accent',
      },
      {
        title: 'Itens vendidos',
        value: this.totalUnits,
        icon: 'inventory',
        color: 'info',
      },
    ];
  }

  private calculateTopProducts(): void {
    const byProduct = new Map<string, TopProductRow>();
    // Considerar apenas vendas concluídas
    const completedSales = this.salesWithMetrics.filter(s => s.status === 'completed');

    for (const sale of completedSales) {
      for (const item of sale.items) {
        const key = item.product.id;
        const existing = byProduct.get(key);
        const revenue = (item.unitPrice * item.quantity) - (item.discount ?? 0);
        if (existing) {
          existing.unitsSold += item.quantity;
          existing.revenue += revenue;
        } else {
          byProduct.set(key, {
            productName: item.product.name,
            unitsSold: item.quantity,
            revenue,
            revenueShare: 0,
          });
        }
      }
    }

    const rows = Array.from(byProduct.values()).sort((a, b) => b.revenue - a.revenue);
    const totalRevenue = rows.reduce((acc, row) => acc + row.revenue, 0);
    this.topProducts = rows.map((row) => ({
      ...row,
      revenueShare: totalRevenue > 0 ? (row.revenue / totalRevenue) * 100 : 0,
    })).slice(0, 5);
  }

  private calculateRecentSales(): void {
    const rows = this.salesWithMetrics
      .map<RecentSaleRow>((sale) => ({
        id: sale.id,
        saleCode: sale.saleCode,
        saleDate: sale.saleDate,
        customerName: sale.customerName,
        totalNet: sale.totalNet,
        status: sale.status,
      }))
      .sort((a, b) => b.saleDate.getTime() - a.saleDate.getTime())
      .slice(0, 5);

    this.recentSales = rows;
  }

  private calculateBreakdowns(): void {
    const statusMap = new Map<Sale['status'], number>();
    const paymentMap = new Map<Sale['paymentMethod'], number>();

    for (const sale of this.salesWithMetrics) {
      statusMap.set(sale.status, (statusMap.get(sale.status) ?? 0) + 1);
      paymentMap.set(sale.paymentMethod, (paymentMap.get(sale.paymentMethod) ?? 0) + 1);
    }

    this.statusBreakdown = Array.from(statusMap.entries()).map(([status, quantity]) => ({
      label: `${this.getStatusLabel(status)} (${quantity})`,
      value: quantity,
      color: status === 'completed' ? '#4caf50' : status === 'pending' ? '#ffc107' : '#f44336',
    }));

    this.paymentBreakdown = Array.from(paymentMap.entries()).map(([method, quantity]) => ({
      label: `${this.getPaymentMethodLabel(method)} (${quantity})`,
      value: quantity,
      color: '#2196f3',
    }));
  }

  private getPaymentMethodLabel(method: Sale['paymentMethod']): string {
    switch (method) {
      case 'pix':
        return 'PIX';
      case 'credit':
        return 'Cartão de crédito';
      case 'debit':
        return 'Cartão de débito';
      case 'cash':
        return 'Dinheiro';
      case 'bank-slip':
        return 'Boleto';
      default:
        return method;
    }
  }
}
