import { CartItem } from '../shared/models/cart-item';
import { Product } from './models/product';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  cartItemsChanged = new EventEmitter<void>(); // Define event emitter

  constructor() {
    this.loadCartFromLocalStorage();
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  addToCart(product: Product) {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        price: 0
      };
      this.cartItems.push(newItem);
    }
    this.saveCartToLocalStorage();
    this.emitCartItemsChanged(); // Emit the event
  }

  removeFromCart(product: Product) {
    const index = this.cartItems.findIndex(item => item.product.id === product.id);
    if (index !== -1) {
      const item = this.cartItems[index];
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        this.cartItems.splice(index, 1);
      }
      this.saveCartToLocalStorage();
      this.emitCartItemsChanged(); // Emit the event
    }
  }

  clearCart() {
    this.cartItems = []; // Clear the cart items
    this.saveCartToLocalStorage();
    this.emitCartItemsChanged(); // Emit the event
  }

  private loadCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData);
    }
  }

  saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  emitCartItemsChanged() {
    this.cartItemsChanged.emit();
  }
}
