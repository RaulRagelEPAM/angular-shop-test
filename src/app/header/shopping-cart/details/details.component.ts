import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from 'src/app/products/interface/product.interface';
import { CartService } from '../service/cart.service';
import { Details } from './interface/details';
import { UtilsService } from 'src/app/utils.service';

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
  detailItems$ = new BehaviorSubject<Details[]>([]); // items parseados

  items: Product[] = []; // items del carrito
  isOpen: boolean = false;
  totalPrice!: number;

  constructor(private cartService: CartService, private utils: UtilsService) { }

  ngOnInit(): void {
    this.cart$ = this.cartService.cartItems$; // ** obervable del carrito

    this.cart$ // ** nos subscribimos para recibir los items
      .pipe(
        // tap(cart => console.log('Productos en el carrito:', cart))
      )
      .subscribe(
        items => {
          this.items = items;
          this.setDetailItems(items);
        }
      );

    // ** nos suscribimos al observable isOpen$ para cambiar $isOpen 
    this.cartService.isOpen$.subscribe(open => this.isOpen = open);
    this.cartService.cartTotalPrice$.subscribe(total => this.totalPrice = total);
  }

  checkout() {
    console.log('Ir al pago');
  }

  remove(productId?: number, removeGroup?: boolean) {
    this.cartService.removeById(productId, removeGroup);
  }

  add(productId: number) {
    this.cartService.addById(productId);
  }

  onClose() {
    this.cartService.toggleCart();
    // ** Se puede hacer directamente:
    // this.cartService.isOpen$.next(!this.isOpen);
  }

  setDetailItems(items: Product[]) {
    let detailItems: Details[] = [];
    let foundItem: Details;

    for(let item of items) {
      foundItem = this.utils.itemById(detailItems, item.id);
      if(foundItem) {
        foundItem.quantity++;
        foundItem.totalPrice = Number((foundItem.totalPrice + item.price).toFixed(2));
      } else {
        detailItems.push({
          id: item.id,
          title: item.title,
          image: item.image,
          quantity: 1,
          totalPrice: item.price
        });
      }
    }
    this.detailItems$.next(detailItems);
  }

}
