import { Product } from './product.model';

export type SaleStatus = 'completed' | 'pending' | 'cancelled';
export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash' | 'bank-slip';

export interface SaleItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface Sale {
  id: string;
  saleDate: Date;
  status: SaleStatus;
  paymentMethod: PaymentMethod;
  items: SaleItem[];
  customerName?: string;
  notes?: string;
}

export interface SaleWithMetrics extends Sale {
  totalGross: number;
  totalDiscount: number;
  totalNet: number;
  totalUnits: number;
}
