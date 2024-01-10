import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Products } from '../common/products';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  private categoryUrl = "http://localhost:8080/api/product-category"
  private baseUrl = "http://localhost:8080/api/products"

  getProductList(categoryId: number): Observable<Products[]>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
    return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage: number,thePageSize: number,categoryId: number): Observable<GetResponseProduct>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}` + `&page=${thePage}&size=${thePageSize}`
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  searchProductByKeyboard(search: string): Observable<Products[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${search}`
    return this.getProducts(searchUrl); 
  }

  searchProductsPaginate(thePage: number,thePageSize: number,searchKeyword: string): Observable<GetResponseProduct>{

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${searchKeyword}` + `&page=${thePage}&size=${thePageSize}`
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Products[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(productId: number): Observable<Products> {
    const searchUrl = `${this.baseUrl}/${productId}`
    return this.httpClient.get<Products>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory) 
    ) 
    }
}

interface GetResponseProduct{
  _embedded: {
    products: Products[],
  },
  page : {
    size : number,
    totalElements : number,
    totalPages : number,
    number : number
  }
}

interface GetResponseCategory{
  _embedded: {
    productCategory: ProductCategory[],
  }
}
