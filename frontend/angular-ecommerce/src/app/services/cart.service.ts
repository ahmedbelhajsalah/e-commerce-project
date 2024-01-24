import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  cartItems: CartItem[] = [];
  totalPrice : Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity : Subject<number> = new BehaviorSubject<number>(0);

  addCartToItem(theCartItem: CartItem){
    let existingCartItem : CartItem | undefined;

    if(this.cartItems.length > 0){
      existingCartItem = this.cartItems.find(item => item.id === theCartItem.id);
    }

    if(existingCartItem){
      existingCartItem.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let cart of this.cartItems){
      totalPriceValue += cart.quantity * cart.unitPrice;
      totalQuantityValue += cart.quantity;
    }
    
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  deletCartItem(cartItem: CartItem) {
    cartItem.quantity--;

    if(cartItem.quantity === 0){
      this.removeItem(cartItem);
    }else{
      this.computeCartTotals();
    }
  }

  removeItem(item: CartItem){
    const indexItem = this.cartItems.findIndex(item => item.id == item.id);
    console.log('index', indexItem);

    if(indexItem != -1){
      this.cartItems.splice(indexItem,1);
      this.computeCartTotals();
    }
  }
}
