import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../interface/product.interface';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Product[] = [];

  constructor(private http: HttpClient) { }

  // ** API 1: https://fakestoreapi.com/docs
  private productsURL: string = 'https://fakestoreapi.com/products';
  // ** Local JSON: 'server/db.json'
  // private productsURL: string = 'http://localhost:3000/products';
  // ** API 2: https://fakestoreapi.in/docs
  // private productsURL: string = 'https://fakestoreapi.in/api/products';

  getProducts(): Observable<any> {
    return this.http.get<Product[]>(this.productsURL); // API 1
    // ** No items test:
    // return of([]).pipe(delay(3000));
    // ** Limit to 10 items test:
    // return this.http.get<Product[]>(this.productsURL).pipe(
    //   map(products => products.slice(0, 3))
    // );

    // return this.http.get<any>(this.productsURL) // API 2
    // .pipe(
    //   map(response => response.products)
    // );
  }
}
