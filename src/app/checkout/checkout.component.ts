import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth-service.service';
import { CartItem } from '../shared/models/cart-item';
import { CartService } from '../shared/cart.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  isLoggedIn: boolean = false;
  cartItems: CartItem[] = [];

  constructor(
    private authService: AuthService,
    public cartService: CartService,
    private modal: NgbActiveModal
  ) { }
  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe((items: CartItem[]) => {
      this.cartItems = items;
    });
  }

  closeModal() {
    this.modal.dismiss('Cross click');
  }

  removeFromCart(cartItem: CartItem) {
    const index = this.cartItems.indexOf(cartItem);

    if (index > -1) {
      this.cartItems.splice(index, 1);
      // this.cartService.saveCartToLocalStorage();
      this.cartService.emitCartItemsChanged();
    }
  }

  checkout() {
    if (this.isLoggedIn) {
      // Perform checkout logic here
      // You can access the cart items using this.cartItems and send them to your server

      // Reset the cart
      this.cartService.clearCart();
      this.modal.dismiss('Checkout click');
    } else {
      // Handle the case when the user is not logged in
      // You can redirect to the login page or show a message
      // For example, redirect to the login page:
      this.authService.redirectToLogin();
    }
  }
}
