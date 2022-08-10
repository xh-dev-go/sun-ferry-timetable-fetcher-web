import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BehaviorSubject, combineLatest, debounceTime, filter, map, merge, of, Subject, switchMap, take} from "rxjs";
import {Scopes} from "pyyqww_t1/dist/Scoping/Scopes";
import {faArrowRightArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {BaseComponent} from "../../base/base.component";
import {SingleSelectionModel} from "pyyqww_t1/dist/selectionModel/SingleSelection";
import {LocalStorageService} from "../../service/local-storage.service";
import {NetworkService, Route} from "../sun-ferry/network.service";
import * as moment from "moment";

interface Subscription {
  register(): Subscription
}

export interface SearchPanelOutput {
  lane: string,
  from: string,
  to: string,
  schedule: Route[]
}

export interface Pair {
  from: string,
  value: string

}

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent extends BaseComponent implements OnInit {
  faArrowRightArrowLeft = faArrowRightArrowLeft
  dayMs = 86400000

  @Output()
  searchResult: EventEmitter<SearchPanelOutput> = new EventEmitter<SearchPanelOutput>()

  // Default value of the selection in DB
  initState = of(1).pipe(
    switchMap((_) => {
      // Set the default
      if (LocalStorageService.exists(this.key)) {
        const value = LocalStorageService.getString(this.key)
        return of({from: "default", value} as Pair)
      } else {
        return this.routeOptionsModel.pipe(
          take(1),
          map<SingleSelectionModel<string>, Pair>(
            (it, _) => {
              return {from: "rom", value: it.findOptions()[0].value().get()}
            }
          )
        )
      }
    }),
    take(1)
  )

  constructor(private networkService: NetworkService) {
    super()
  }

  userSelected = new Subject<string>()
  userSelectObservable = this.userSelected.pipe(
    filter((it) => it !== ""),
    map<string,Pair>((it) => {return {from:"user-select", value:it}})
  )

  anySelection = merge(
    this.userSelectObservable,
    this.initState
  )
    .pipe<Pair>(
      filter(it => it.value !== "")
    )

  lineOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])

  routeOptionsModel: Subject<SingleSelectionModel<string>> = new Subject<SingleSelectionModel<string>>()
  routeOptions = this.routeOptionsModel.pipe(
    map((it) => it.getAll())
  )

  LAYOUT = 'EEE, d MMM YYYY'


  /* Set the date bar */
  tmr = (date: Date) => Scopes.of(new Date(date)).apply((it) => it.setTime(it.getTime() + this.dayMs)).get()
  yesterday = (date: Date) => Scopes.of(new Date(date)).apply((it) => it.setTime(it.getTime() - this.dayMs)).get()

  dateOpt = new BehaviorSubject<Date>(new Date()) //today
  dateYesterdayOpt = this.dateOpt.pipe(map((it) => this.yesterday(it)))
  dateTmrOpt = this.dateOpt.pipe(map((it) => this.tmr(it)))

  /* Set the to / from bar */
  fromOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  from: BehaviorSubject<string> = new BehaviorSubject<string>("")
  toOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  to: BehaviorSubject<string> = new BehaviorSubject<string>("")

  setDateAsToday() {
    this.dateOpt.next(Scopes.of(new Date()).apply(it => it!.setHours(0, 0, 0)).get()!)
  }

  key: string = "ferry-schedule/route/last"

  override ngOnInit() {
    super.ngOnInit();


    this.sub(
      this.networkService.getRoutes() // when start get all routes
        .subscribe(it => {
          console.log("Load all routes" + it)

          this.routeOptionsModel.next(SingleSelectionModel.New(it)
            .register(SingleSelectionModel.NewHook(
              _ => {
              },
              value => this.userSelected.next(value.value().get()), // selecting an item, user select have new value
              _ => {
              }
            )))
        })
    )

    this.sub(
      // when user select, save to the history
      this.userSelected
        .pipe(
          filter((it) => it !== "")
        )
        .subscribe((it) => {
          const value = LocalStorageService.getString(this.key)
          if (value !== it) {
            LocalStorageService.set(this.key, it)
          }
        })
    )


    this.sub(
      this.anySelection
        .subscribe((line) => {
            this.networkService.getLineOptions(NetworkService.toDisplay(line.value))
              .subscribe((it) => {
                this.lineOptions.next(it)
              })
          }
        )
    )
    this.sub(
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
      combineLatest([
          this.to.pipe(filter((it) => it !== null && it !== undefined && it !== "")),
          this.from.pipe(filter((it) => it !== null && it !== undefined && it !== "")),
          this.dateOpt,
          this.anySelection
        ]
      )
        .pipe(
          debounceTime(10),
        )
        .subscribe((it) => {
          const to = it[0]
          const from = it[1]
          const dateOpt = it[2]
          const dest = it[3]

          const dateString = Scopes.of(dateOpt).map(it => moment(it).format("YYYYMMDD")).get()

          this.networkService.getSchedule(
            NetworkService.toValue(dest.value),
            NetworkService.toValue(from),
            NetworkService.toValue(to),
            dateString
          )
            .subscribe((it) => {

              this.searchResult.next({
                lane: `${dest} Lane`,
                from: this.from.value,
                to: this.to.value,
                schedule: it
              })
            })
        })
    )
  }

  switch() {
    let f = this.from.value
    let t = this.to.value
    this.from.next(t)
    this.to.next(f)
  }

}
