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

  getProductList(): Observable<Products[]>{
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
      map(response => response._embedded.products)
    )
  }
}

interface GetResponse{
  _embedded: {
    products: Products[],
  }
}
