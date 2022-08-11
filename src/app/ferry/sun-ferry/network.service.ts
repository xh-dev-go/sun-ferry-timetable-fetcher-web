import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, filter, firstValueFrom, from, map, Observable, take} from "rxjs";
import {BaseService} from "../../base/base.service";
import {Router} from "@angular/router";

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
