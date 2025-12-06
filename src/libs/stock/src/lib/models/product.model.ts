import { Category } from './category.model';

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
