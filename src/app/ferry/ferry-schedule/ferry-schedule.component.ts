import {Component, OnInit} from '@angular/core';
import {NetworkService, Route} from "../sun-ferry/network.service";
import {BaseComponent} from "../../base/base.component";
import {BehaviorSubject, combineLatest, filter, from, map, take} from "rxjs";

@Component({
  selector: 'app-ferry-schedule',
  templateUrl: './ferry-schedule.component.html',
  styleUrls: ['./ferry-schedule.component.css']
})
export class FerryScheduleComponent extends BaseComponent implements OnInit {
  routes: string[] = []
  selecting: BehaviorSubject<string> = new BehaviorSubject<string>("")
  lineOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  fromOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  from: BehaviorSubject<string> = new BehaviorSubject<string>("")
  toOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  to: BehaviorSubject<string> = new BehaviorSubject<string>("")

  schedule: Route[] = []

  constructor(private networkService: NetworkService) {
    super()
  }

  override ngOnInit() {
    super.ngOnInit();
    this.subscriptions.push(
      this.networkService.getRoutes()
        .subscribe(it => {
          console.log(it)
          this.routes = it
          this.selecting.next(this.routes[0])
        })
    )

    this.subscriptions.push(
      this.selecting
        .pipe(
          filter(it => it !== "")
        )
        .subscribe(it => {
            this.networkService.getLineOptions(NetworkService.toDisplay(this.selecting.value))
              .subscribe(it => {
                this.lineOptions.next(it)
              })
          }
        )
    )

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
      combineLatest([
          this.to.pipe(map((it, _) => 1)),
          this.from.pipe(map((it, _) => 1))
        ]
      )
        .subscribe(it => {
          this.networkService.getSchedule(NetworkService.toValue(this.selecting.value), NetworkService.toValue(this.from.value), NetworkService.toValue(this.to.value))
            .subscribe(it => this.schedule = it)
        })
    )
  }
}
