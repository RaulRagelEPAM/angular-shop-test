import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from 'src/app/products/interface/product.interface';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class CartComponent implements OnInit {

  // ** Opción pasandole y recibiendo datos del componente padre (shopping-cart)
  // @Input() cart$!: Observable<Product[]>;
  // @Output() closeDetailsEvent = new EventEmitter<void>();
  cart$!: Observable<Product[]>;
  items: Product[] = [];
  isOpen: boolean = false;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cart$ = this.cartService.cartItems$; // ** obervable del carrito

    this.cart$ // ** nos subscribimos para recibir los items
      .pipe(
        tap(cart => console.log('Productos en el carrito:', cart))
      )
      .subscribe(
        items => this.items = items
      );

    // ** nos suscribimos al observable isOpen$ para cambiar $isOpen 
    this.cartService.isOpen$
    .subscribe(open => this.isOpen = open);
  }

  checkout() {
    console.log('Ir al pago');
  }

  onClose() {
    this.cartService.toggleCart();
  }

}
