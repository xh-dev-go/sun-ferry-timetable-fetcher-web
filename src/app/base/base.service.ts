import {Injectable, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {NetworkService} from "../ferry/sun-ferry/network.service";

@Injectable({
  providedIn: 'root'
})
export class BaseService implements OnDestroy {
  protected subscriptions: Subscription[] = []
  baseUrl():string {
    return `${this.networkService.url}`
  }
  constructor(protected networkService: NetworkService) { }

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
