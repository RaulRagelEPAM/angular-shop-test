import { Component, Input, Output,OnInit, EventEmitter } from '@angular/core';
import { Product } from '../interface/product.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Input() product!: Product;
  @Output() addToCartEvent = new EventEmitter<Product>();

  constructor() { }

  onClick(): void {
    this.addToCartEvent.emit(this.product);
  }

  ngOnInit(): void {

  }

}
