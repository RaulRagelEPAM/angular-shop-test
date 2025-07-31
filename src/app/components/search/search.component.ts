import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/services/products.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchControl = new FormControl('');
  results: any = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.searchControl.valueChanges
    .pipe(
      debounceTime(1000), // espera 1 segundo antes de seguir
      // distinctUntilChanged(), // no busca si no cambió el texto
      switchMap(value => this.productService.getSearch(value)) // **
    )
    .subscribe(
      results => {
        console.log('RESULTS', results);
        if(results) this.results = results;
      }
    );
  }

  getSearch() {
    console.log(this.productService.searchProducts('mens'));
  }

}

// ! Queremos poder buscar cualquier cosa, ignorando mayusuclas, minusculas, espacios, comillas etc
// ! esto podemos hacerlo si quitamos todos los espacios, comas y aplicamos toLowerCase,
// ! tanto a los productos como a la búsqueda

// Notas:
//** switchMap: cancela la anterior llamada si se ha seguido escribiendo
//**            es importante que se devuelva un observable (en este caso getSearch debe serlo)
//**            si no tienes datos que sean asincronos utiliza of()