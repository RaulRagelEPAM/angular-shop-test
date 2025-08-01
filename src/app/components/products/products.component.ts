import { Component, OnInit } from '@angular/core';

import { ProductService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { tap } from 'rxjs/operators'
import { Product } from '../../interfaces/product.interface';
import { FiltersService } from 'src/app/services/filters.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Array<Product> = [];
  // _allProducts: Array<Product> = [];
  errorMsg: string = '';
  loading = false;
  filter$!: Observable<string>;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private filtersService: FiltersService
  ) { }

  addToCart(product: Product): void {
    // console.log('Add to cart:', product);
    this.cartService.addToCart(product);
  }

  ngOnInit(): void {
    this.loading = true;
    this.productService.init();

    this.productService.productsToShow$
    .pipe(
      tap(() => this.loading = false)
    )
    .subscribe(
      resp => {
        // this._allProducts = resp;
        // this.filtersService.setFilters(resp);
        this.products = resp;
      },
      error => {
        this.errorMsg = error;
        this.loading = false;
      }
    );

    // this.filter$ = this.filtersService.filter$;
    // this.filter$
    // .pipe(
    //   tap(filter => console.log('Filter changed:', filter))
    // )
    // .subscribe(
    //   filter => {
    //     this.products = this._allProducts;
    //     if(filter !== 'Todos') {
    //       this.products = this._allProducts.filter(
    //         product => product.category.toLowerCase() === filter.toLowerCase()
    //       );
    //     }
    //   }
    // );
  }

}

