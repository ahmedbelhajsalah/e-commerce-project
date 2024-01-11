import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  cartItems: CartItem[] = [];
  totalPrice : Subject<number> = new Subject<number>;
  totalQuantity : Subject<number> = new Subject<number>;

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
}
