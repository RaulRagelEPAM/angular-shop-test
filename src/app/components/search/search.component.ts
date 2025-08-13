import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/services/products.service';
import { SearchService } from 'src/app/services/search.service';
import { VoiceService } from 'src/app/services/voice.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchControl = new FormControl('');
  recording:boolean = false;

  constructor(private searchService: SearchService, private voiceService: VoiceService) { }

  ngOnInit(): void {
    this.searchControl.valueChanges
    .pipe(
      debounceTime(500), // espera medio segundo antes de seguir
      // distinctUntilChanged(), // no busca si no cambió el texto
      switchMap(value => this.searchService.search(value)) // **
    )
    .subscribe(
      newText => {
        console.log('searchControl changed:', newText);
      }
    );

    this.voiceService.transcript$.subscribe(text => {
      if (text) {
        console.log('transcript changed:', text);
        this.searchControl.setValue(text);
      }
    });

    this.voiceService.recording$.subscribe(isRecording => {
      console.log('isRecording:', isRecording);
      this.recording = isRecording;
    });
  }

  emptyInput() {
    this.searchControl.setValue('');
  }

  startVoice() {
    this.voiceService.startListening();
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

