import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, filter, firstValueFrom, map, Observable, take} from "rxjs";
import {BaseService} from "../../base/base.service";

@Injectable({
  providedIn: 'root',
})
export class NetworkService extends BaseService {
  url: string

  static toMap(sm: any): Map<string, Map<string, string>> {
    const r = new Map<string, Map<string, string>>()
    Object.entries(sm).map((pair, v) => {
      let key = pair[0]
      let value = pair[1] as any[]
      let m = new Map<string, string>()
      r.set(key, m)
      Object.entries(value).map((e, _) => {
        let key = e[0]
        let value = e[1]
        m.set(key, value)
      })
    })
    return r
  }

  public getServiceMap(): Observable<Map<string, Map<string, string>>> {
    return this.routesMapSubject.pipe(
      filter(it => it.size > 0),
      take(1)
    )
  }

  public getRoutes(): Observable<string[]> {
    return this.getServiceMap()
      .pipe(
        map((it, _) => [...it.keys()]),
        map((it, _) => it.map((word, _) => NetworkService.toDisplay(word)))
      )
  }

  public async getLineOptions(route: string): Promise<string[]>{
    let routes = await firstValueFrom(this.getRoutes())
    if(!routes.includes(route)){
      alert("Route not match")
    }
    let locationPoints = await firstValueFrom(this.getServiceMap())
    if(locationPoints === undefined){
      alert("Not allow undefined")
    }
    return [...(locationPoints.get(NetworkService.toValue(route)))!.keys()]
  }

  static toDisplay(word: string): string {
    return word.split("-").map((subWord, _) => {
      switch (subWord.length) {
        case 0:
          return subWord
        case 1:
          return subWord.toUpperCase()
        default:
          return subWord.charAt(0).toUpperCase() + subWord.slice(1)
      }
    }).join(" ")
  }

  static toValue(word: string): string {
    return word.split(" ").map((subWord, _) => {
      switch (subWord.length) {
        case 0:
          return subWord
        case 1:
          return subWord.toLowerCase()
        default:
          return subWord.charAt(0).toLowerCase() + subWord.slice(1)
      }
    }).join("-")
  }

  constructor(private http: HttpClient) {
    super()
    this.url = `${environment.host}/v1/ferry/sun-ferry`
    this.subscriptions.push(
      this.http.get<any>(`${this.url}/service-map`)
        .pipe(
          map((a, _) => NetworkService.toMap(a))
        )
        .subscribe(it => {
          this.routesMapSubject.next(it)
        })
    )
  }

  private routesMapSubject = new BehaviorSubject<Map<string, Map<string, string>>>(new Map())

}
