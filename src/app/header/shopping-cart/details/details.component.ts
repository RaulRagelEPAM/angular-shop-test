import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from 'src/app/products/interface/product.interface';
import { CartService } from '../service/cart.service';
import { Details } from './interface/details';

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

  items: Product[] = []; // items del carrito
  isOpen: boolean = false;
  totalPrice!: number;
  detailItems: Details[] = []; // items parseados
  // detailItems: Array<any> = []; // items parseados

  constructor(private cartService: CartService) { }

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

  onClose() {
    this.cartService.toggleCart();
  }

  setDetailItems(items: Product[]) {
    let foundItem: Details;
    this.detailItems = [];
    for(let item of items) {
      console.log('setDetailItems', item);
      foundItem = this.searchById(this.detailItems, item.id);
      if(foundItem) {
        foundItem.quantity++;
        foundItem.totalPrice = Number((foundItem.totalPrice + item.price).toFixed(2));
      } else {
        this.detailItems.push({
          id: item.id,
          title: item.title,
          image: item.image,
          quantity: 1,
          totalPrice: item.price
        });
      }
    }
  }

  searchById(items: Array<any>, id: number) {
    return items.find(item => item.id === id);
  }

}
