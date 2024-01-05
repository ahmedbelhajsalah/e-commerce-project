import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service.service';
import { Products } from '../../common/products';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Products[] = [];
  categoryId: number = 1;
  constructor(private productService: ProductService, private router: ActivatedRoute){}

  ngOnInit(): void {
    this.router.paramMap.subscribe(()=>{
      this.listProducts();
    });
  }

  listProducts(){
    const hasCategory: boolean = this.router.snapshot.paramMap.has('id');

    if(hasCategory){
      this.categoryId = +this.router.snapshot.paramMap.get('id')!;
    }else{
      this.categoryId = 1;
    }
    this.productService.getProductList(this.categoryId).subscribe(
      data => this.products = data
    )
  }


}
