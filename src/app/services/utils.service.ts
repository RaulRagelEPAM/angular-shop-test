import { Injectable } from '@angular/core';

type PlatformType = 'WEB' | 'TIZEN' | 'WEBOS';

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

  detectPlatform(): PlatformType {
    if (typeof window !== 'undefined') {
      if ((window as any).tizen) {
        return 'TIZEN';
      }
      if ((window as any).webOS || (window as any).PalmSystem) {
        return 'WEBOS';
      }
    }
    return 'WEB';
  }
}
