import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/services/products.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchControl = new FormControl('');
  results: Product[] = [];

  constructor(private searchService: SearchService, ) { }

  ngOnInit(): void {
    this.searchControl.valueChanges
    .pipe(
      debounceTime(500), // espera 1 segundo antes de seguir
      // distinctUntilChanged(), // no busca si no cambió el texto
      switchMap(value => this.searchService.search(value)) // **
    )
    .subscribe(
      results => {
        console.log('RESULTS', results);
        // if(results) this.results = results;
      }
    );
  }

  emptyInput() {
    this.searchControl.setValue('');
  }

}

// ! Queremos poder buscar cualquier cosa, ignorando mayusuclas, minusculas, espacios, comillas etc
// ! esto podemos hacerlo si quitamos todos los espacios, comas y aplicamos toLowerCase,
// ! tanto a los productos como a la búsqueda

// Notas:
//** switchMap: cancela la anterior llamada si se ha seguido escribiendo
//**            es importante que se devuelva un observable (en este caso getSearch debe serlo)
//**            si no tienes datos que sean asincronos utiliza of()