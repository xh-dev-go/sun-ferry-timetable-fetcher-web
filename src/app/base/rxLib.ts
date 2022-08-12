import {BehaviorSubject, filter, map, Observable, Subject} from "rxjs";
import {Scopes} from "pyyqww_t1/dist/Scoping/Scopes";

export interface ObsPair<T> {
  sub: Subject<T>
  obs: Observable<T>
}

export module RxServiceService {
  export function obs<T>(): ObsPair<T> {
    const subject = new BehaviorSubject<T | null>(null)
    const observable = subject.pipe(
      filter((it) => it !== null),
      map((it) => it!)
    )

    let curValue = ()=>subject.value

    return {sub: subject as Subject<T>, obs: observable}
  }

  export function obsd<T>(d: T): ObsPair<T> {
    const subject = new BehaviorSubject<T>(d)
    return {sub: subject, obs: subject}
  }

}
