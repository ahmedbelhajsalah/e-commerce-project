import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit {

  constructor(private cartService: CartService){}

  cartItem: CartItem[]= [];
  cartPrice: number = 0.
  cartQuantity: number = 0;

  ngOnInit(): void {
    this.productList()
  }


  productList(){
    this.cartItem = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(data =>{
      this.cartPrice = data;
    });

    this.cartService.totalQuantity.subscribe(data =>{
      this.cartQuantity = data;
    });

    this.cartService.computeCartTotals();
    console.log('cart', this.cartItem)

  }

}
