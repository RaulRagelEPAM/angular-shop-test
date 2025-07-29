import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from 'src/app/products/interface/product.interface';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class CartComponent implements OnInit {

  @Input() cart$!: Observable<Product[]>;
  @Output() closeDetailsEvent = new EventEmitter<void>();
  items: Product[] = [];

  constructor() { }

  ngOnInit(): void {
    this.cart$
      .pipe(
        tap(cart => console.log('Productos en el carrito:', cart))
      )
      .subscribe(
        items => this.items = items
      );
  }

  onClick() {

  }

  onClose() {
    this.closeDetailsEvent.emit();
  }

}
