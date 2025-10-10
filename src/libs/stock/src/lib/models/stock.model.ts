import { Product } from "./product.model";

export interface IStock {
    product: Product;
    minAmount: number;
    maxAmount: number;
    currentAmount: number;
    totalSales: number;
    
}