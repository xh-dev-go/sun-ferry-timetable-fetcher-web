import {Injectable} from '@angular/core';
import {ImBusyModule} from "pyyqww_t1/dist/imBusy/ImBusy";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BusyManService{
  busyMan = ImBusyModule.busyMan()
  busyStream = new BehaviorSubject<boolean>(this.busyMan.amIBusy())

  getBusyMan():ImBusyModule.BusyMan{
    return this.busyMan
  }
  getBusyStream():Observable<boolean>{
    return this.busyStream
  }

  constructor() {
    this.busyMan.register(ImBusyModule.NewSimpleHook(
      it=>this.busyStream.next(it),
      it=>this.busyStream.next(it)
    ))
  }


}
