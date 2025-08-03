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
  filterSelected = '';
  errorMsg: string = '';
  loading = false;
  filter$!: Observable<string>;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  addToCart(product: Product): void {
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
        this.products = resp;
      },
      error => {
        this.errorMsg = error;
        this.loading = false;
      }
    );
  }

}

