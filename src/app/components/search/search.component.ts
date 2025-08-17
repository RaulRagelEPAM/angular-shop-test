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

// NOTAS
// ** switchMap: 
// ** es un operador de alta priridad, lo que quiere decir que trabaja con observables dentro de observables,
// ** por lo que permite que primero se resuelva el valueChanges y luego el search

// ** en este caso, lo usamos para que cancele la anterior llamada si se ha seguido escribiendo
// ** es importante que se devuelva un observable, en este caso search debe serlo, por lo que
// ** usamos of() para devolver datos planos pero en forma de observable

// ** tambien se podría usar para hacer una llamada dentro de otra si por ejemplo necesitamos llamar
// ** a una api para obtener un id para luego llamar a otra api distinta usando ese id

