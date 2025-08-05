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
//** Clase Subscription
//** Cuando hacemos un .subscribe, estamos creando una suscripción anónima, que realmente es
//** una instancia de Subscrition, por lo que no hace falta almacenarla en una variable
//** Sin embargo, podríamos guardarlo en un objeto de tipo Subscription para luego poder hacer un unsubscribe
//** si fuera necesario hacer una desuscripción.
//** Si por ejemplo quisieramos dejar de recibir productos anque la variable productsToShow$ siga cambiando,
//** tendríamos que almancenar la suscripción tal que así:
/*
    //** Creamos una variable que maneja la suscripción y almacenamos el observable.subscribe
    private productsSub!: Subscription;

    this.productsSub = this.productService.productsToShow$ ...(resto del código)

    //** Y ahora cuando se destruye el componente (por ejemplo) podemos desuscribirnos:
    ngOnDestroy(): void {
      this.productsSub?.unsubscribe(); // Liberamos la memoria si dejamos de usar el componente
    }
*/
//** Operador takeUntil
//** El operador takeUntil escucha otro observable (por ejemplo destroy$),
//** y en cuanto ese observable emite un valor (next), la suscripción activa se cancela automáticamente.
//** Esto nos permite evitar llamar manualmente a unsubscribe y manejar múltiples suscripciones de forma más limpia.
//** Para usarlo como en el ejemplo anterior con ngOnDestroy, haríamos lo siguiente:
/*
    this.productService.productsToShow$
    .pipe(
      tap(() => this.loading = false),
      takeUntil(this.destroy$) //** Escucha destroy$ y se desuscribe automáticamente cuando este emite algo
    )

    ...(resto del código)
  
    ngOnDestroy(): void {
      this.destroy$.next(); //** Forzamos que el observable productsToShow$ se desuscriba
      this.destroy$.complete(); //** Cerramos destroy$ (buena práctica)
    }
*/