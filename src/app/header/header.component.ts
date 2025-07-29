import { Component } from '@angular/core';
import { ProductService } from '../products/service/products.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private productService: ProductService) { }

  cart$ = this.productService.cartAction$;
  total$ = this.productService.totalAction$;
  length$ = this.productService.lengthAction$;

}
