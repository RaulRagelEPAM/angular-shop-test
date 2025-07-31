import { FiltersService } from './../../services/filters.service';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';
import { UtilsService } from '../../services/utils.service';
import { Filter } from '../../interfaces/filter';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  filters: Filter[] = [];

  constructor(
    private productService: ProductService,
    private utils: UtilsService,
    private filtersService:FiltersService
  ) { }

  ngOnInit(): void {
    this.productService.products$ // ** no hacemos llamada adicional, solo vemos los cambios en products
    .subscribe(
      products => {
        if(products) this.parseFilters(products);
        // ** La primera vez es vacío porque BehaviorSubject emite un valor cuando nos suscribimos
        console.log('filters', this.filters);
      }
    );
  };

  parseFilters(products: Product[]): void {
    let uniqueFilters = [...new Set(products.map(item => item.category))]; // ! y si viene otro nombre del back que no sea category?
    let filters = uniqueFilters.map(item => ({
      name: this.utils.capitalize(item),
      focused: false
    }));

    filters.unshift({
      name: 'Todos',
      focused: true
    });

    filters.unshift({
      name: 'Invent',
      focused: false
    });

    this.filters = filters;
  };

  selectFilter(filterSelected: string): void {
    this.filters = this.filters.map(filter => ({
      ...filter,
      focused: filter.name === filterSelected
    }));

    this.filtersService.setFilter(filterSelected);
  };
}
