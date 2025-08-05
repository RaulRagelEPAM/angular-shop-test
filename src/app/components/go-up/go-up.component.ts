import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, map, tap, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-go-up',
  // **
  template: `
    <button class="go-up" mat-icon-button title="Volver arriba"
      [class.hidden]="!showButton"
      (click)="scrollUp()"
    >
      <mat-icon>arrow_circle_up</mat-icon>
  </button>
  `,
  styleUrls: ['./go-up.component.css']
})
export class GoUpComponent implements OnInit {

  scrollEvent$ = fromEvent(window, 'scroll');
  showButton = false;

  constructor() { }

  ngOnInit(): void {
    this.scrollEvent$
    .pipe(
      // throttleTime(200), // **
      // debounceTime(200), // **
      // tap(() => console.log(window.scrollY)),
      map(() => window.scrollY), // **
    )
    .subscribe(
      (scrollY) => this.showButton = scrollY > 300
    );
  }

  scrollUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}


// NOTAS
/*
  Clase hidden:
  Ambas líneas aplican la clase hidden en función de showButton:
    [ngClass]="{'hidden': !showButton}"
    [class.hidden]="!showButton"          -> Mejor para una sola clase

  throttleTime:
  Solo queremos una emisión cada x milisegundos, aunque se reciban más frecuentemente.
  En este caso no funciona muy bien porque hay muy poco scroll (es fácil llegar abajo del todo antes de los 200ms).

  debounceTime:
  Se dispara cuando se detiene el flujo de eventos, así que a diferencia de throttleTime, se va a activar siempre
  pero solo cuando dejemos de hacer scroll.

  Map en fromEvent scroll:
  En el evento no tenemos el scroll, asique cuando se detecte scroll, simplemente devolvemos el scrollY de window.
*/