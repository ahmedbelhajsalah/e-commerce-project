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

  searchProductByKeyboard(search: string): Observable<Products[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${search}`
    return this.getProducts(searchUrl); 
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
  }
}

interface GetResponseCategory{
  _embedded: {
    productCategory: ProductCategory[],
  }
}
