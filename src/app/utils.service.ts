import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  itemById(items: Array<any>, id: number) {
    return items.find(item => item.id === id);
  }

  indexById(items: Array<any>, id: number): number {
    return items.findIndex(item => item.id === id);
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  capitalizeArray(arr: string[]): string[] {
    return arr.map(s => this.capitalize(s));
  }
}
