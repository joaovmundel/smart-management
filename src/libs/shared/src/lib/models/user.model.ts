/* eslint-disable @nx/enforce-module-boundaries */
import { Product } from '../services/product.service';
import {
  Category,
  IStockedProductWithMetadata,
  SaleWithMetrics,
} from '@smart-management/stock';

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  company?: {
    id: number;
    name: string;
  } | null;
  photo?: string;
  // Campos apenas para frontend (formulários)
  password?: string;
  confirmPassword?: string;
  registerToken?: string;
  categories?: Category[];
  products?: Product[];
  stockedProducts?: IStockedProductWithMetadata[];
  sales?: SaleWithMetrics[];
}
