import { Component, OnInit } from '@angular/core';

import { ProductService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { tap } from 'rxjs/operators'
import { Product } from '../../interfaces/product.interface';
import { FiltersService } from 'src/app/services/filters.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Array<Product> = [];
  filterSelected = '';
  errorMsg: string = '';
  loading = false;
  filter$!: Observable<string>;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  ngOnInit(): void {
    this.loading = true;
    this.productService.init();

    this.productService.productsToShow$
    .pipe(
      tap(() => this.loading = false)
    )
    .subscribe( // **
      resp => {
        this.products = resp;
      },
      error => {
        this.errorMsg = error;
        this.loading = false;
      }
    );
  }

}


// NOTAS 
//** Cuando hacemos un .subscribe, realmente estamos creando una suscripción anónima, pero esto
//** podríamos guardarlo en un objeto de tipo Subscription para luego poder hacer un unsubscribe
//** si fuera necesario hacer una dessuscripción.
//** Si por ejemplo quisieramos dejar de recibir productos anque la variable productsToShow$ siga cambiando,
//** tendríamos que almancenar la suscripción tal que así:
/*
    //** Creamos una variable que maneja la suscripción y almacenamos el observable.subscribe
    private productsSub!: Subscription;

    this.productsSub = this.productService.productsToShow$ ...(resto del código)

    //** Y ahora cuando se destruye el componente (por ejemplo) podemos dessuscribirnos:
    ngOnDestroy(): void {
      this.productsSub?.unsubscribe(); // Liberamos la memoria si dejamos de usar el componente
    }
*/
