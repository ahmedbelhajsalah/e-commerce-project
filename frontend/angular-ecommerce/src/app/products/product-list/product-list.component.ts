import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service.service';
import { Products } from '../../common/products';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Products[] = [];
  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.listProducts();
  }

  listProducts(){
    this.productService.getProductList().subscribe(
      data => this.products = data
    )
  }


}
