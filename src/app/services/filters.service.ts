import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '../interfaces/filter';
import { ProductService } from './products.service';
import { Product } from '../interfaces/product.interface';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  private filterSelectedSubject = new BehaviorSubject<string>('');
  private filtersSubject = new BehaviorSubject<Filter[]>([]);

  constructor(
    private utils: UtilsService,
    private productService: ProductService
  ) { }

  filterSelected$ = this.filterSelectedSubject.asObservable();
  filters$ = this.filtersSubject.asObservable();

  setFilters(products: Product[]): void {
    let uniqueFilters = [...new Set(products.map(item => item.category))];
    let filters = uniqueFilters.map(item => ({
      name: this.utils.capitalize(item),
      focused: false
    }));

    filters.unshift({
      name: 'Todos',
      focused: true
    });

    this.filtersSubject.next(filters);
  }

  setCurrentFilter(filter: string) {
    this.filterSelectedSubject.next(filter);
  }

}
