import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth-service.service';
import { CartItem } from '../shared/models/cart-item';
import { Product } from './models/product';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  cartItemsChanged = new EventEmitter<void>();
  userId?: number;
  cartId?: number;
  private getUrl = 'http://localhost:8000/getcart/';
  private postUrl = 'http://localhost:8000/postcart/';


  constructor(private http: HttpClient, private authService: AuthService) {
    this.cartItems = [];
    // this.loadCartFromLocalStorage();
    this.authService.authStatus.subscribe((status: boolean) => {
      if (status) {
        this.userId = this.authService.userId!;
      } else {
        console.log("User not authenticated");
        this.userId = undefined;
        this.cartItems = [];
      }
    });
  }

  public getImageUrlForProduct(product: Product): string {
    return `http://localhost:8000${product.image}`;
  }

  addToCart(product: Product) {
    const newItem: CartItem = {
      id: 0,
      product,
      quantity: 1,
      price: product.price,
      userId: this.userId
    };
    const existingItem = this.cartItems.find(
      (item) => item.product.id === product.id && item.userId === newItem.userId   
    );
    console.log(existingItem);
    
    if (existingItem) {
      console.log("addtocart if, here = ", existingItem);
      existingItem.quantity++;
    } else {
      console.log("addtocart else, here = ", existingItem);
      this.cartItems.push(newItem);
    }
    this.saveCartToServer()
    this.getCartItemCount()
    this.emitCartItemsChanged();
  }
  
  saveCartToServer() {
    const updatedCartItems = this.cartItems.map((cartItem) => ({
      cart: cartItem.id,
      product: cartItem.product.id,
      quantity: cartItem.quantity,
      userId: this.userId
    }));
  
    const cartData = {
      userId: this.userId,
      cartItems: updatedCartItems
    };
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
  
    this.http.post(this.postUrl, cartData, { headers }).subscribe(
      (response) => {
        this.clearCart();
      },
      (error) => {
        console.error('Failed to save cart:', error);
      }
    );
  }
  
  
  clearCart() {
    this.cartItems = [];
    // this.saveCartToLocalStorage();
    this.emitCartItemsChanged();
  }

  removeFromCart(cartItemId: number) {
    const itemIndex = this.cartItems.findIndex((item) => item.id === cartItemId);
  
    if (itemIndex !== -1) {
      const item = this.cartItems[itemIndex];
      this.deleteCartItemFromServer(item).subscribe(() => {
          this.cartItems.splice(itemIndex, 1); 
          // this.saveCartData();
          this.getCartItems()
          this.getCartItemCount()
          this.emitCartItemsChanged()
          // this.updateCartItemsOnServer().subscribe(
          //   () => {
          //     this.saveCartData();
          //     this.emitCartItemsChanged();
          //   },
          //   (error) => {
          //     console.error('Failed to update cart items on server:', error);
          //   }
          // );
        },
        (error) => {
          console.error('Failed to delete cart item from server:', error);
        }
      );
    } else {
      console.log('Item not found in cart');
    }
  }
  getCartItems(): Observable<CartItem[]> {
    // this.loadCartFromLocalStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
  
    return this.http.get<any>(this.getUrl, { headers }).pipe(
      tap(response => {
        this.cartItems = response.cartItems; // Assign the received cart items to the cartItems property
      }),
      map(response => response.cartItems)
    );
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  deleteCartItemFromServer(cartItem: CartItem): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
  
    const deleteUrl = `${this.postUrl}delete-item/${cartItem.id}/`;
  
    return this.http.delete<any>(deleteUrl, { headers });
  }
  
  updateCartItemsOnServer(): Observable<any> {
    const cartData = {
      userId: this.userId,
      cartItems: this.cartItems.map((cartItem) => ({
        cart: cartItem.id,
        product: cartItem.product.id,
        quantity: cartItem.quantity,
        userId: this.userId
      }))
    };
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
  
    return this.http.post<any>(this.postUrl + this.cartId, cartData, { headers });
  }

  emitCartItemsChanged() {
    this.cartItemsChanged.emit();
  }

// not in use
  // public saveCartData() {
  //   // this.saveCartToLocalStorage();
  //   this.saveCartToServer();
  // }
  private loadCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart');

    if (cartData) {
      this.cartItems = JSON.parse(cartData);
    }
  }

  // saveCartToLocalStorage() {
  //   localStorage.setItem('cart', JSON.stringify(this.cartItems));
  // }
}  


  // getCartItemsFromServer(): Observable<void> {
  //   return this.http.get<any>(this.getUrl).pipe(
  //     tap(response => {
  //       console.log('Cart Items Response:', response);
  //       this.cartItems = response.cartItems;
  //       console.log("here get cart" ,this.cartItems);
        
  //     }),
  //     map(() => {})
  //   );
  // }
  