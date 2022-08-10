import {Injectable} from '@angular/core';
import {BusyManService} from "../service/busy-man.service";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  constructor(private busyManService: BusyManService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`[Make Request]: ${req.method}|${req.url}`)
    let job = this.busyManService.busyMan.newJob()
    return next.handle(req).pipe(
      tap(it=>{
        if(it instanceof HttpResponse){
          console.log(`[Response]: ${it.url}`)
          job.doneMyJob()
        }
      }),
      catchError((err)=>{
        console.log(err)
        job.doneMyJob()
        throw err
      })
    )

  }
}
