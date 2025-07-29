import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../products/service/products.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  constructor(private productService: ProductService) { }

  cart$ = this.productService.cartAction$;
  total$ = this.productService.totalAction$;
  length$ = this.productService.lengthAction$;

  cartIsOpen: boolean = false;

  ngOnInit(): void {
  }

  toggleCart(): void {
    this.cartIsOpen = !this.cartIsOpen;
  }

}
