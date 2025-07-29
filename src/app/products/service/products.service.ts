import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
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

  // CARRITO DE LA COMPRA
  private shoppingCart: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);
  private lengthSubject = new BehaviorSubject<number>(0);
  //--------------------------------------------------------

  get cartAction$(): Observable<Product[]> {
    return this.cartSubject.asObservable(); // asObservable permite que solo sea de lectura
  }
  get totalAction$(): Observable<number> {
    return this.totalSubject.asObservable();
  }
  get lengthAction$(): Observable<number> {
    return this.lengthSubject.asObservable();
  }

  updateCart(product: Product): void {
    this.addToCart(product);
    this.setTotalPrice();
    this.setTotalLength();
  }

  private addToCart(product: Product): void {
    this.shoppingCart.push(product);
    this.cartSubject.next(this.shoppingCart);
  }

  private setTotalPrice(): void {
    const total = this.shoppingCart.reduce(
      (acc, product) => acc += product.price, 0
    );
    this.totalSubject.next(Number(total.toFixed(2)));
  }

  private setTotalLength(): void {
    const length = this.shoppingCart.length;
    this.lengthSubject.next(length);
  }
}
