import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../interfaces/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data != null) {
      this.cartItems = data;

      this.cartTotal();
    }
  }

  addToCart(cartItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | null = null;

    if (this.cartItems.length > 0) {
      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === cartItem.id) {
          existingCartItem = tempCartItem;
        }
      }

      alreadyExistsInCart = existingCartItem ? true : false;
    }

    if (alreadyExistsInCart) {
      existingCartItem!.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.cartTotal();
  }

  cartTotal() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.storageCartItems();
  }

  storageCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    } else {
      this.cartTotal();
    }
  }

  remove(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(
      (tempCartItem) => tempCartItem.id === cartItem.id
    );

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.cartTotal();
    }
  }
}
