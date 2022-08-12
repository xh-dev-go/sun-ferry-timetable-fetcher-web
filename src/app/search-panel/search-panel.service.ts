import {Injectable} from '@angular/core';
import {BehaviorSubject, filter, firstValueFrom, from, map, Observable, take} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BaseService} from "../base/base.service";
import {NetworkService} from "../ferry/sun-ferry/network.service";
import {Scopes} from "pyyqww_t1/dist/Scoping/Scopes";
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class SearchPanelService extends BaseService {
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
        map((it, _) => it.map((word, _) => SearchPanelService.toDisplay(word)))
      )
  }

  public getLineOptions(route: string): Observable<string[]>{
    let getRoutes = ()=>this.getRoutes()
    let getServiceMap = ()=>this.getServiceMap()
    return from(new Promise<string[]>(async function (myResolve, reject){
      try{
        let routes = await firstValueFrom(getRoutes())
        if(!routes.includes(route)){
          alert("Route not match")
        }
        let locationPoints = await firstValueFrom(getServiceMap())
        if(locationPoints === undefined){
          alert("Not allow undefined")
        }
        myResolve([...(locationPoints.get(SearchPanelService.toValue(route)))!.keys()])
      } catch (e) {
        reject(e)
      }
    }))
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

  constructor(private http: HttpClient,networkService: NetworkService) {
    super()
    this.url = `${networkService.url}/v1/ferry/sun-ferry`
    console.log(`Base URL: ${this.url}`)
    this.subscriptions.push(
      this.http.get<any>(`${this.url}/service-map`)
        .pipe(
          map((a, _) => SearchPanelService.toMap(a))
        )
        .subscribe(it => {
          this.routesMapSubject.next(it)
        })
    )
  }

  private routesMapSubject = new BehaviorSubject<Map<string, Map<string, string>>>(new Map())


  getSchedule(line: string, from: string, to: string, date: Date): Observable<Route[]> {
    const dateString = Scopes.of(date).map(it => moment(it).format("YYYYMMDD")).get()
    return this.http.get<RouteDto[]>(`${this.url}/${line}/${from}/${to}/${dateString}`)
      .pipe(
        map((it, _) => it.map(it => toRoute(it)))
      )
  }
}

export interface RouteDto{
  Route:string,
  From:string,
  ZhFrom:string,
  To:string,
  ZhTo:string,
  Frequency:string[],
  Time: number,
  Speed: string,
  Remark: string,
  ZhRemark: string,
}
export interface Route{
  Route:string,
  From:string,
  ZhFrom:string,
  To:string,
  ZhTo:string,
  Frequency:string[],
  Time: string,
  Date: Date,
  Speed: string,
  Remark: string,
  ZhRemark: string,
}
const toRoute = (self: RouteDto):Route=>{
  const today = new Date()
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), self.Time / 100, self.Time % 100, 0)
  const pad = (num:number, size:number) => {
    var s = "000000000" + num;
    return s.slice(s.length-size);
  }
  return  {
    Route: self.Route,
    From: self.From,
    ZhFrom: self.ZhFrom,
    To: self.To,
    ZhTo: self.ZhTo,
    Frequency: self.Frequency,
    Time: pad(self.Time, 4),
    Date: d,
    Speed: self.Speed,
    Remark: self.Remark,
    ZhRemark: self.ZhRemark,
  } as Route
}
