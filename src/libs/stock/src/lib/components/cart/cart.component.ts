import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { CartItem } from '../../models/cart-item.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'sm-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatBadgeModule,
  ],
})
export class CartComponent {
  @Output() checkoutComplete = new EventEmitter<CartItem[]>();
  @Output() cartCleared = new EventEmitter<void>();

  cartItems: CartItem[] = [];

  get totalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  get totalValue(): number {
    return this.cartItems.reduce((total, item) => total + item.subtotal, 0);
  }

  get isEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  addProduct(product: Product, quantity = 1): void {
    const existingItem = this.cartItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      this.updateQuantity(product.id, existingItem.quantity + quantity);
    } else {
      const newItem: CartItem = {
        product,
        quantity,
        subtotal: product.saleValue * quantity,
      };
      this.cartItems = [...this.cartItems, newItem];
    }
  }

  removeProduct(productId: string): void {
    this.cartItems = this.cartItems.filter(
      (item) => item.product.id !== productId
    );
  }

  updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeProduct(productId);
      return;
    }

    this.cartItems = this.cartItems.map((item) => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: item.product.saleValue * newQuantity,
        };
      }
      return item;
    });
  }

  incrementQuantity(productId: string): void {
    const item = this.cartItems.find((i) => i.product.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrementQuantity(productId: string): void {
    const item = this.cartItems.find((i) => i.product.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartCleared.emit();
  }

  checkout(): void {
    if (this.isEmpty) {
      return;
    }

    const items = [...this.cartItems];
    this.checkoutComplete.emit(items);
    this.clearCart();
  }
}
