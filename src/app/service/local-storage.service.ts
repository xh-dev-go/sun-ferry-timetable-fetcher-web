import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  static exists = (name: string): boolean => window.localStorage.getItem(name) !== null && window.localStorage.getItem(name) !== ""
  static getString = (name: string): string | null => LocalStorageService.exists(name) ? window.localStorage.getItem(name)! : null
  static get = <T>(name: string): T | null => LocalStorageService.exists(name) ? JSON.parse(window.localStorage.getItem(name)!) : null
  static set = <T>(name: string, value: string): void => window.localStorage.setItem(name, value)
}
