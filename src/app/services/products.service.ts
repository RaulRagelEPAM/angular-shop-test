import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { delay, map, tap } from 'rxjs/operators';
import { FiltersService } from './filters.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // ** API: https://fakestoreapi.com/docs
  private productsURL: string = 'https://fakestoreapi.com/products';
  // ** Local JSON: 'server/db.json'
  // private productsURL: string = 'http://localhost:3000/products';

  private productsSubject = new BehaviorSubject<Product[]>([]);
  private productsToShowSubject = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient, private filtersService: FiltersService) { }

  get products$(): Observable<Product[] | null> { // **
    return this.productsSubject.asObservable();
  }

  get productsToShow$(): Observable<Product[]> { // **
    return this.productsToShowSubject.asObservable();
  }

  init(): void {
    this.http.get<Product[]>(this.productsURL)
    .pipe(
      tap(response => console.log('Productos:', response))
    )
    .subscribe(
      response => {
        this.productsSubject.next(response);
        this.productsToShowSubject.next(response);
        this.filtersService.initFilters(response);
      }
    );

    this.filtersService.filterSelected$
    .pipe(
      tap(filter => console.log('Filter changed:', filter))
    )
    .subscribe(
      filter => {
        this.productsToShowSubject.next(this.filtersService.getFilteredProducts(this.productsSubject.value, filter))
      }
    );
  }

  getSearch(str: string): any {
    return of(this.searchProducts(str));
  }

  searchProducts(str: string): any {
    if(this.productsSubject.value) {
      return this.productsSubject.value.filter(
        item => this.clean(item.title).includes(this.clean(str))
      );
    }
  }

  clean(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }
}



//---------------

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

// Notas:
// ** productsSubject es el observable que usamos aqui a nivel privado y products$ el que usamos en el exterior
// ** de esta forma no exponemos productsSubject y sus propiedades, pero realmente ambos son lo mismo
// ** incluso podría ser una variable normal publica de la clase (products$ = this.productsSubject.asObservable();)