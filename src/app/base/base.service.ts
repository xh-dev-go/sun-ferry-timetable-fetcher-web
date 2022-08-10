import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BaseService implements OnDestroy {
  protected subscriptions: Subscription[] = []

  constructor() { }

  ngOnDestroy(): void {
    this.subscriptions.map(it=>{
      if(!it.closed){
        it.unsubscribe()
      }
    })
  }

  sub(sub: Subscription){
    this.subscriptions.push(sub)
  }
}
