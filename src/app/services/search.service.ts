import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchTxtSubject = new BehaviorSubject<string>('');
  searchTxt$ = this.searchTxtSubject.asObservable();

  constructor() { }

  search(txt: string) {
    this.searchTxtSubject.next(txt);
    return of(txt);
  }

  searchProducts(products: Product[], str: string): any {
    if(products) {
      return products.filter(
        item => this.minifyTxt(item.title).includes(this.minifyTxt(str))
      );
    }
  }

  minifyTxt(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }
}
