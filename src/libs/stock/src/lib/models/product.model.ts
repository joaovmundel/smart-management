import { Category } from './category.model';

export interface Product {
  id: string;
  name: string;
  description?: string;
  photoUrl?: string;
  stockAmount: number;
  saleValue: number;
  grossValue: number;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
  color?: Color[];
  sizes?: Size[];
}

export interface Size {
  id: string;
  label: string;
  description?: string;
}

export interface Color {
  id?: string;
  name: string;
  code: string;
}

