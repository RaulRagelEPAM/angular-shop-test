import { Component, OnInit } from '@angular/core';

import { ProductService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { tap } from 'rxjs/operators'
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Array<Product> = [];
  errorMsg: string = '';
  loading = false;

  constructor(private productService: ProductService, private cartService: CartService) { }

  addToCart(product: Product): void {
    // console.log('Add to cart:', product);
    this.cartService.addToCart(product);
  }

  ngOnInit(): void {
    this.loading = true;
    this.productService.getProducts()
    .pipe(
      tap(() => this.loading = false)
    )
    .subscribe(
      resp => this.products = resp,
      error => {
        this.errorMsg = error;
        this.loading = false;
      }
    );
  }

}

