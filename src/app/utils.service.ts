import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  itemById(items: Array<any>, id: number) {
    return items.find(item => item.id === id);
  }

  indexById(items: Array<any>, id: number) {
    return items.findIndex(item => item.id === id);
  }
  
}
