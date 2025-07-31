import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  constructor(private cartService: CartService) { }

  cart$ = this.cartService.cartItems$; // ** no es necesario suscribirse porque async del html se suscribe solo
  total$ = this.cartService.cartTotalPrice$;
  length$ = this.cartService.cartLength$;

  ngOnInit(): void {
  }

  toggleCart(): void {
    this.cartService.toggleCart();
  }

}
