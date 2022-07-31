import {Component, OnInit} from '@angular/core';
import {NetworkService, Route} from "../sun-ferry/network.service";
import {BaseComponent} from "../../base/base.component";
import {BehaviorSubject, combineLatest, debounceTime, filter, map, merge} from "rxjs";
import * as moment from 'moment';
import {BusyManService} from "../../service/busy-man.service";
import {faArrowRightArrowLeft, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {SingleSelectionModel} from "pyyqww_t1/dist/selectionModel/SingleSelection";
import {Scopes} from "pyyqww_t1/dist/Scoping/Scopes";
import {LocalStorageService} from "../../service/local-storage.service";

@Component({
  selector: 'app-ferry-schedule',
  templateUrl: './ferry-schedule.component.html',
  styleUrls: ['./ferry-schedule.component.css']
})
export class FerryScheduleComponent extends BaseComponent implements OnInit {

  faArrowRightArrowLeft = faArrowRightArrowLeft
  faSpinner = faSpinner

  // routes: string[] = []
  preSelecting: BehaviorSubject<string> = new BehaviorSubject<string>("")
  selecting: BehaviorSubject<string> = new BehaviorSubject<string>("")
  lineOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  routeOptions: SingleSelectionModel<string> = SingleSelectionModel.NewWithDefault<string>([])
  fromOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  from: BehaviorSubject<string> = new BehaviorSubject<string>("")
  toOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  to: BehaviorSubject<string> = new BehaviorSubject<string>("")
  dateYesterdayOpt = new BehaviorSubject<Date>(new Date())
  dateOpt = new BehaviorSubject<Date>(new Date())
  dateTmrOpt = new BehaviorSubject<Date>(new Date())
  LAYOUT = 'EEE, d MMM YYYY'

  schedule: Route[] = []

  constructor(private networkService: NetworkService, private busyManService: BusyManService) {
    super()
  }

  key: string = "ferry-schedule/route/last"

  override ngOnInit() {
    super.ngOnInit();
    this.subscriptions.push(
      this.networkService.getRoutes()
        .subscribe((it) => {
          console.log(it)
          if (LocalStorageService.exists(this.key)) {
            const value = LocalStorageService.getString(this.key)
            this.selecting.next(value!)
          } else {
            this.selecting.next(it[0])
          }
          this.routeOptions = SingleSelectionModel.New(it)
            .register(SingleSelectionModel.NewHook(
              it=>{},
              it => this.preSelecting.next(it.value().get()),
              _ => {
              }
            ))
          // this.routeOptions = SingleSelectionModel.New(it)
          //   .register(SingleSelectionModel.NewHook(
          //     it => this.selecting.next(it.value().get()),
          //     _ => {
          //     }
          //   ))
        })
    )

    this.subscriptions.push(
      this.preSelecting
        .pipe(
          filter((it)=>Scopes.ofNullable(it).exists() && it!=="")
        )
        .subscribe((it) => {
        const value = LocalStorageService.getString(this.key)
        if (value !== it) {
          LocalStorageService.set(this.key, it)
        }
      })
    )

    this.subscriptions.push(
      merge(
        this.preSelecting,
        this.selecting
      )
        .pipe(
          filter(it => it !== "")
        )
        .subscribe(it => {
            this.networkService.getLineOptions(NetworkService.toDisplay(this.selecting.value))
              .subscribe((it) => {
                this.lineOptions.next(it)
              })
          }
        )
    )
    // this.subscriptions.push(
    //   this.selecting
    //     .pipe(
    //       filter(it => it !== "")
    //     )
    //     .subscribe(it => {
    //       if(LocalStorageService.exists(this.key)){
    //         const value = LocalStorageService.getString(this.key)
    //         if(value !== it){
    //           LocalStorageService.set(this.key, it)
    //
    //         }
    //       }
    //         this.networkService.getLineOptions(NetworkService.toDisplay(this.selecting.value))
    //           .subscribe((it) => {
    //             this.lineOptions.next(it)
    //           })
    //       }
    //     )
    // )

    this.subscriptions.push(
      this.lineOptions.pipe(
        filter(it => it.length > 0)
      )
        .subscribe(stops => {
          this.from.next(stops[0])
          this.fromOptions.next(stops)

          this.to.next(stops[1])
          this.toOptions.next(stops)

        })
    )

    this.subscriptions.push(
      this.from
        .subscribe(fromStop => {
          if (fromStop === this.to.value) {
            let next = this.toOptions.value.filter(it => it !== fromStop)[0]
            this.to.next(next)
          }
        })
    )

    this.subscriptions.push(
      this.to
        .subscribe(toStop => {
          if (toStop === this.from.value) {
            let next = this.fromOptions.value.filter(it => it !== toStop)[0]
            this.from.next(next)
          }
        })
    )
    this.subscriptions.push(
      this.dateOpt
        .pipe(
          filter(it => it !== null && it !== undefined)
        )
        .subscribe(it => {
          const dayMs = 86400000
          const tmr = Scopes.of(new Date(it)).apply(it => it!.setTime(it!.getTime() + dayMs)).get()
          const yesterday = Scopes.of(new Date(it)).apply(it => it!.setTime(it!.getTime() - dayMs)).get()

          this.dateYesterdayOpt.next(yesterday)
          this.dateTmrOpt.next(tmr)
        })
    )

    this.subscriptions.push(
      combineLatest([
          this.to.pipe(
            filter(it => it !== null),
            filter(it => it !== undefined),
            map((it, _) => 1)
          ),
          this.from.pipe(
            filter(it => it !== null),
            filter(it => it !== undefined),
            map((it, _) => 1)
          ),
          this.dateOpt.pipe(
            filter(it => it !== null),
            filter(it => it !== undefined),
            map((it, _) => 1)
          )
        ]
      )
        .pipe(
          debounceTime(10)
        )
        .subscribe(_ => {
          const dateString = Scopes.of(this.dateOpt.value).map(it => moment(it).format("YYYYMMDD")).get()

          this.networkService.getSchedule(
            NetworkService.toValue(this.selecting.value),
            NetworkService.toValue(this.from.value),
            NetworkService.toValue(this.to.value),
            dateString
          )
            .subscribe(it => this.schedule = it)
        })
    )

  }

  busyStatus = this.busyManService.getBusyStream()
    .pipe()

  switch() {
    let f = this.from.value
    let t = this.to.value
    this.from.next(t)
    this.to.next(f)
  }

  setDateAsToday() {
    this.dateOpt.next(Scopes.of(new Date()).apply(it => it!.setHours(0, 0, 0)).get()!)
  }
}
