import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '../interfaces/filter';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  private filterSubject = new BehaviorSubject<string>('');

  constructor() { }

  filter$ = this.filterSubject.asObservable();

  setFilter(filter: string) {
    this.filterSubject.next(filter);
  }

}
