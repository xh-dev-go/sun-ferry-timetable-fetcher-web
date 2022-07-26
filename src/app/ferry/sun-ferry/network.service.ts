import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NetworkService implements OnInit, OnDestroy {
  url: string

  toMap(sm: any): Map<string, Map<string, string>> {
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
    return this.http.get<any>(`${this.url}/service-map`)
      .pipe(
        map((a, _) => {
          return this.toMap(a)
        })
      )
  }

  constructor(private http: HttpClient) {
    this.url = `${environment.host}/v1/ferry/sun-ferry`


  }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
  }


}
