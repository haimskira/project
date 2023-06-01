import { Component } from '@angular/core';
import { CartService } from '../shared/cart.service';
import { CartItem } from '../shared/models/cart-item';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  decreaseQuantity(cartItem: CartItem) {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
    }
  }

  increaseQuantity(cartItem: CartItem) {
    cartItem.quantity++;
  }

  removeFromCart(cartItem: CartItem) {
    const index = this.cartItems.indexOf(cartItem);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      // Update the local storage to reflect the updated cart items array
      this.cartService.saveCartToLocalStorage();
      this.cartService.emitCartItemsChanged(); // Emit the event
    }
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((count, cartItem) => count + cartItem.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, cartItem) => total + cartItem.product.price * cartItem.quantity,
      0
    );
  }

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
  }
}
