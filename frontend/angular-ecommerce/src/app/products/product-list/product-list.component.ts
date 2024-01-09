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
  searchMode!: string;
  constructor(private productService: ProductService, private router: ActivatedRoute){}

  ngOnInit(): void {
    this.router.paramMap.subscribe(()=>{
      this.listProducts();
    });
  }

  listProducts(){
    this.searchMode = this.router.snapshot.paramMap.get('keyword')!;

    if(this.searchMode){
      this.handelSearch(this.searchMode)
    }else{
      this.listAllProducts();
    }
  }

  handelSearch(search : string){
    this.productService.searchProductByKeyboard(search).subscribe(
      data => this.products = data
    )
  }

  listAllProducts(){
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
