import { Category } from './category.model';

export interface Product {
  id: string;
  name: string;
  description?: string;
  photoUrl?: string;
  saleValue: number;
  grossValue: number;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}


