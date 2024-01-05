import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Products } from '../common/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  private baseUrl = "http://localhost:8080/api/products"

  getProductList(categoryId: number): Observable<Products[]>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId/id=${categoryId}`
    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  }
}

interface GetResponse{
  _embedded: {
    products: Products[],
  }
}
