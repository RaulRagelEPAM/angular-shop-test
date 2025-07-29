import { Component, OnInit } from '@angular/core';

import { ProductService } from './service/products.service';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators'
import { Product } from './interface/product.interface';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Array<Product> = [];
  errorMsg: string = '';
  loading$ = new BehaviorSubject<boolean>(false);

  constructor(private productService: ProductService) { }

  addToCart(product: Product): void {
    console.log('Add to cart:', product);
    this.productService.updateCart(product);
  }

  ngOnInit(): void {
    this.loading$.next(true);
    this.productService.getProducts()
    .pipe(
      tap(() => this.loading$.next(false)),
      tap(resp => console.log('Productos:', resp))
    )
    .subscribe(
      resp => this.products = resp,
      error => {
        this.errorMsg = error;
        this.loading$.next(false);
      }
    );
  }

}

