import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent implements OnInit {

  constructor(private cartService: CartService){

  }
  totalPrice: number = 0;
  totalQuantity: number = 0;

  ngOnInit(): void {
    this.cartService.totalPrice.subscribe(data =>{
      this.totalPrice = data;
    });
    this.cartService.totalQuantity.subscribe(data =>{
      this.totalQuantity = data;
    })
  }

}
