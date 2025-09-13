import { Category } from "./category.model";

export interface Product {
  id: string;
  name: string;
  description?: string;
  photoUrl?: string;
  stockAmount: number;
  saleValue: number;
  grossValue: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithCategory extends Product {
  category: Category;
}
