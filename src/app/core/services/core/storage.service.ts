import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  set(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  get(key: string) {
    const stringifiedItem = localStorage.getItem(key);
    return stringifiedItem ? JSON.parse(stringifiedItem) : null;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
