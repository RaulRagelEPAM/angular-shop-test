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

  constructor(private filtersService:FiltersService) { }

  ngOnInit(): void {
    this.filtersService.filters$ // ** no hacemos llamada adicional, solo vemos los cambios en filtros
    .subscribe(
      filters => {
        if(filters) this.filters = filters;
      }
    );
  };

  selectFilter(filterSelected: string): void {
    this.filtersService.setCurrentFilter(filterSelected);
  };
}
