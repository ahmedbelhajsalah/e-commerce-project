import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service.service';
import { ActivatedRoute } from '@angular/router';
import { Products } from '../../common/products';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  constructor(private productService: ProductService, private route: ActivatedRoute){}

  productId!: number;
  product!: Products;

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>
      this.handleProductDetails()
    )
  }

  handleProductDetails(){
    this.productId = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(this.productId).subscribe(result =>{
      this.product = result;
    })
  }



}
