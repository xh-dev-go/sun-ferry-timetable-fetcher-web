import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  filter,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  tap
} from "rxjs";
import {Scopes} from "pyyqww_t1/dist/Scoping/Scopes";
import {faArrowRightArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {BaseComponent} from "../../base/base.component";
import {Selection, SingleSelectionModel} from "pyyqww_t1/dist/selectionModel/SingleSelection";
import {LocalStorageService} from "../../service/local-storage.service";
import {SearchPanelService} from "../../search-panel/search-panel.service";
import {time} from "../../base/timeLib";
import yesterday = time.yesterday;
import tmr = time.tmr;
import toDay = time.toDay;

export interface SearchPanelOutput {
  lane: string,
  from: string,
  to: string,
  date: Date
  // schedule: Route[]
}

export interface Pair {
  from: string,
  value: string
}

export class ToFrom {
  fromOption: string[] = []
  from = ""
  toOption: string[] = []
  to = ""

  updateTo(to: string): ToFrom {
    if (this.toOption.includes(to)) {
      if (to === this.from) {
        const fromOptions = this.fromOption.filter((it) => it !== this.from)
        if (fromOptions.length > 0) {
          return ToFrom.of(this.fromOption, fromOptions[0], this.toOption, to)
        } else {
          throw Error("swap to from option")
        }
      } else {
        return ToFrom.of(this.fromOption, this.from, this.toOption, to)
      }
    } else {
      throw Error("to not contains")
    }
  }

  updateFrom(from: string): ToFrom {
    if (this.fromOption.includes(from)) {
      if (from === this.to) {
        const toOptions = this.toOption.filter((it) => it !== from)
        if (toOptions.length > 0) {
          return ToFrom.of(this.fromOption, from, this.toOption, toOptions[0])
        } else {
          throw Error("swap to to option")
        }
      } else {
        return ToFrom.of(this.fromOption, from, this.toOption, this.to)
      }
    } else {
      throw Error("from not contains")
    }
  }

  switch(): ToFrom {
    return this.updateFrom(this.to).updateTo(this.from)
  }

  constructor(fromOption: string[], from: string, toOption: string[], to: string) {
    this.fromOption = fromOption
    this.toOption = toOption
    this.from = from;
    this.to = to;
    if(from === to && from !== ""){
      throw Error("From and To is the same")
    }
  }

  static empty(): ToFrom {
    return new ToFrom([], "", [], "")
  }

  static of(fromOption: string[], from: string, toOption: string[], to: string): ToFrom {
    return new ToFrom(fromOption, from, toOption, to)
  }

  isEmpty(): boolean {
    return this.from === "" || this.to === ""
  }

  nonEmpty(): boolean {
    return !this.isEmpty()
  }
}

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent extends BaseComponent implements OnInit {
  faArrowRightArrowLeft = faArrowRightArrowLeft

  @Output()
  searchResult: EventEmitter<SearchPanelOutput> = new EventEmitter<SearchPanelOutput>()

  @Input()
  allowSwitchDate = true

  // --------------- Init Stages---------------------
  //
  // Default value of the selection in DB
  initState = of(1).pipe(
    switchMap((_) => {
      // Set the default
      if (LocalStorageService.exists(this.key)) {
        const value = LocalStorageService.getString(this.key)
        return of({from: "default", value} as Pair)
      } else {
        return this.routeOptionsModel.pipe(
          filter((it)=>it!==null),
          take(1),
          map((it)=>it!),
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

  // --------------- Second Stages---------------------
  //

  userSelectedRoute = new Subject<string>() // user select route
  userSelectObservable = this.userSelectedRoute.pipe(
    filter((it) => it !== ""),
    map<string, Pair>((it) => {
      return {from: "user-select", value: it}
    })
  )

  anySelection = merge(
    this.userSelectObservable,
    this.initState
  )
    .pipe<Pair>(
      filter(it => it.value !== "")
    )

  lineOptions: Observable<string[]> = this.anySelection
    .pipe(
      switchMap((line) => {
        return this.searchPanelService.getLineOptions(SearchPanelService.toDisplay(line.value))
      })
    )

  routeOptionsModel: BehaviorSubject<SingleSelectionModel<string>|null> = new BehaviorSubject<SingleSelectionModel<string>|null>(null)

  routeOptions: Observable<Selection<string>[]> = this.routeOptionsModel.pipe(
    filter((it) => it !== null),
    map((it) => it!.getAll()),
    tap((it) => {
      console.log(["latest route", ...it.map(it => it.value().get())].reduce((a, b) => `${a}\n${b}`))
    })
  )

  /* Set the to / from bar */
  toFrom: Subject<ToFrom> = new Subject<ToFrom>()
  toFromObs:Observable<ToFrom> = merge(
    this.toFrom.pipe(filter((it) => it.nonEmpty())),
    this.lineOptions.pipe(
      filter(it => it.length > 0),
      map((it) => ToFrom.of(it, it[0], it, it[1]))
    )
  )

  constructor(private searchPanelService: SearchPanelService) {
    super(searchPanelService)
  }


  LAYOUT = 'EEE, d MMM YYYY'


  /* Set the date bar */

  dateOpt = new BehaviorSubject<Date>(new Date()) //today
  dateToday = this.dateOpt.pipe(
    map((it) =>
      Scopes.of(new Date(it)).apply(it => it!.setHours(0, 0, 0)).get()!
    )
  )
  dateYesterdayOpt = this.dateToday.pipe(map((it) => yesterday(it)))
  dateTmrOpt = this.dateToday.pipe(map((it) => tmr(it)))

  toFromObservable = this.lineOptions.pipe(
    filter(it => it.length > 0),
    map((listOption) => ToFrom.of(listOption, listOption[0], listOption, listOption[1]))
  )


  key: string = "ferry-schedule/route/last"

  override ngOnInit() {
    super.ngOnInit();


    this.sub(
      combineLatest([
        this.routeOptionsModel.pipe(
          filter((it)=>it!==null),
          map((it)=>it!)),
        this.initState
      ])
        .subscribe((it) => {
          const model: SingleSelectionModel<string> = it[0]
          const pair: Pair = it[1]
          if (pair.from === "default") {
            model.select(pair.value)
          }
        })
    )

    this.sub(
      // when user select, save to the history
      this.userSelectedRoute
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

    // Any change will trigger refresh
    this.sub(
      combineLatest([
          this.toFromObs.pipe(filter((it) => it.nonEmpty())),
          this.dateOpt,
          this.anySelection
        ]
      )
        .pipe(
          debounceTime(10),
        )
        .subscribe((it) => {
          const to = it[0].to
          const from = it[0].from
          const date = it[1]
          const dest = it[2]

          this.searchResult.next({
            lane: dest.value,
            from,
            to,
            date
          })

        })
    )

    this.sub(
      this.searchPanelService.getRoutes() // when start get all routes
        .subscribe(it => {
          console.log("Load all routes" + it)

          this.routeOptionsModel.next(SingleSelectionModel.New(it)
            .register(SingleSelectionModel.NewHook(
              _ => {
              },
              value => this.userSelectedRoute.next(value.value().get()), // selecting an item, user select have new value
              _ => {
              }
            )))
        })
    )
  }


  toDay():Date {
    return toDay()
  }

  yesterday(value: Date) {
    return yesterday(value);
  }

  tmr(value: Date) {
    return tmr(value);
  }
}
