import { UtilsService } from './../../../utils.service';
import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/products/interface/product.interface';
import { Details } from '../details/interface/details';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private shoppingCart: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);
  private lengthSubject = new BehaviorSubject<number>(0);
  isOpen$ = new BehaviorSubject<boolean>(false);

  constructor(private utils: UtilsService) { }

  // ** Getter de angular sin necesidad de hacer una función además agregamos
  // ** asObservable que permite que solo sea de lectura (no tenemos las funiones de los observables al devolverlo)
  get cartItems$(): Observable<Product[]> {
    return this.cartSubject.asObservable();
  }
  get cartTotalPrice$(): Observable<number> {
    return this.totalSubject.asObservable();
  }
  get cartLength$(): Observable<number> {
    return this.lengthSubject.asObservable();
  }

  toggleCart(): void {
    this.isOpen$.next(!this.isOpen$.value);
  }

  remove(product?: Details) {
    if(product) this.removeFromCart(product);
    else this.shoppingCart = [];
    this.updateCart();
  }

  addToCart(product: Product): void {
    this.shoppingCart.push(product);
    this.updateCart();
  }

  updateCart(): void {
    this.cartSubject.next(this.shoppingCart);
    this.setTotalPrice();
    this.setTotalLength();
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

  private removeFromCart(item: Details): void {
    debugger;
    console.log('this.shoppingCart', this.shoppingCart);
    this.shoppingCart.splice(
      this.utils.indexById(this.shoppingCart, item.id), 1
    );
  }
}
