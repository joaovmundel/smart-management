import { Product } from './product.model';

export interface IStockedProduct extends Product {
  minAmount: number;
  maxAmount: number;
  currentAmount: number;
  totalSales: number;
  stockedValue?: number;
  potentialProfit?: number;
}

export interface IStockedProductWithMetadata extends IStockedProduct {
  stockLevel?: 'critical' | 'attention' | 'recommended' | 'excess';
  progressColor?: 'warn' | 'accent' | 'primary';
  progressPercentage?: number;
}
