import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  url: string

  constructor() {
    if(!environment.production){
      this.url = `${environment.host}/api`
    } else {
      this.url = `${window.location.protocol}//${window.location.host}/api`
    }
  }

}
