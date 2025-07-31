import { Component, OnInit } from '@angular/core';
import { ProductService } from '../products/service/products.service';
import { Product } from '../products/interface/product.interface';
import { UtilsService } from '../utils.service';
import { Filter } from './interface/filter';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  filters: Filter[] = [];

  constructor(private productService: ProductService, private utils: UtilsService) { }

  ngOnInit(): void {
    this.productService.products$
    .subscribe(
      products => {
        // if(products) this.filters = [...new Set(products.map(item => item.category))];
        if(products) this.parseFilters(products);
        // ** La primera vez es vacío porque BehaviorSubject emite un valor cuando nos suscribimos
        console.log('filters', this.filters);
      }
    );
  };

  parseFilters(products: Product[]): void {
    let uniqueFilters = [...new Set(products.map(item => item.category))];
    let filters = uniqueFilters.map(item => ({
      name: this.utils.capitalize(item),
      focused: false
    }));

    filters.unshift({
      name: 'Todos',
      focused: true
    });

    this.filters = filters;
  };

  selectFilter(filterSelected: string): void {
    this.filters = this.filters.map(filter => ({
      ...filter,
      focused: filter.name === filterSelected
    }));
  };
}
