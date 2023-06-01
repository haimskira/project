import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../shared/auth-service.service';
import { CartItem } from '../shared/models/cart-item';
import { CartService } from '../shared/cart.service';

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
    private cartService: CartService,
    private modal: NgbActiveModal
    
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.loggedIn;
    this.cartItems = this.cartService.getCartItems();
  }

  closeModal() {
    this.modal.dismiss('Cross click');
  }

  checkout() {
    // Perform checkout logic here
    // You can access the cart items using this.cartItems and send them to your server

    // Reset the cart
    this.cartService.clearCart();
    this.modal.dismiss('Checkout click');
  }
}
