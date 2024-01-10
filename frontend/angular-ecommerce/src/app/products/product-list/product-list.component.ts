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

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 1;
  previousCategoryId: number = 1;
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
    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, search).subscribe(
      this.processResult()
    );
  }

  listAllProducts(){
    const hasCategory: boolean = this.router.snapshot.paramMap.has('id');

    if(hasCategory){
      this.categoryId = +this.router.snapshot.paramMap.get('id')!;
    }else{
      this.categoryId = 1;
    }

    if(this.previousCategoryId != this.categoryId){
      this.thePageNumber=1;
    }

    this.previousCategoryId = this.categoryId;
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.categoryId).subscribe(
      this.processResult()
    );
  }

  updateSize(value: string) {
    this.thePageSize = +value;
    this.thePageNumber = 1;
    this.listProducts();
    }

    processResult(){
      return (data: any) =>{
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    }

    addToCart(theProduct: Products){
      console.log('cart: ',theProduct);
    }

}
