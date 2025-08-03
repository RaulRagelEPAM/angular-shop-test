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

  readonly allFilter: Filter = {
    name: 'Todos',
    focused: false
  }

  private filterSelectedSubject = new BehaviorSubject<string>('');
  private filtersSubject = new BehaviorSubject<Filter[]>([]);

  constructor(private utils: UtilsService) { }

  filterSelected$ = this.filterSelectedSubject.asObservable();
  filters$ = this.filtersSubject.asObservable();

  initFilters(products: Product[]): void {
    let uniqueFilters = [...new Set(products.map(item => item.category))];
    let filters = uniqueFilters.map(item => ({
      name: this.utils.capitalize(item),
      focused: false
    }));

    filters.unshift(this.allFilter);

    this.filtersSubject.next(filters);

    this.setCurrentFilter(this.allFilter.name);
  }

  setCurrentFilter(filterSelected: string) {
    this.filtersSubject.next(this.filtersSubject.value.map(filter => ({
      ...filter,
      focused: filter.name === filterSelected
    })));

    this.filterSelectedSubject.next(filterSelected);
  }

  getFilteredProducts(products: Product[], filter: string) {
    let productsToShow = products;
    if(filter !== this.allFilter.name) {
        productsToShow = products.filter(
          product => product.category.toLowerCase() === filter.toLowerCase()
        );
      }
    return productsToShow;
  }

}
