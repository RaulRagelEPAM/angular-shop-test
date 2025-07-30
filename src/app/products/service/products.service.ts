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

  // API: https://fakestoreapi.com/docs
  private productsURL: string = 'https://fakestoreapi.com/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsURL);
    // ** No items test:
    // return of([]).pipe(delay(3000));
    // ** Limit to 10 items test:
    // return this.http.get<Product[]>(this.productsURL).pipe(
    //   map(products => products.slice(0, 3))
    // );
  }
}
