import {Component, OnInit} from '@angular/core';
import {SearchPanelOutput} from "../search-panel/search-panel.component";
import {RxServiceService} from "../../base/rxLib";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {Route, SearchPanelService} from "../../search-panel/search-panel.service";
import {time} from "../../base/timeLib";
import obs = RxServiceService.obs;
import tmr = time.tmr;
import obsd = RxServiceService.obsd;


@Component({
  selector: 'app-next-ferry',
  templateUrl: './next-ferry.component.html',
  styleUrls: ['./next-ferry.component.css'],
})
export class NextFerryComponent implements OnInit {
  constructor(private searchPanelService: SearchPanelService) {
  }

  searchOutput = obs<SearchPanelOutput>()
  takeFirst = obsd<number>(3)
  routes = obsd<Route[]>([])

  ngOnInit(): void {
    this.searchOutput.obs
      .pipe(
        switchMap<SearchPanelOutput, Observable<[Route[], Route[]]>>((it) => {
          return forkJoin([
            this.searchPanelService.getSchedule(
              SearchPanelService.toValue(it.lane),
              SearchPanelService.toValue(it.from),
              SearchPanelService.toValue(it.to), it.date),
            this.searchPanelService.getSchedule(
              SearchPanelService.toValue(it.lane),
              SearchPanelService.toValue(it.from), SearchPanelService.toValue(it.to), tmr(it.date))
              .pipe(
                map((it) =>
                  it.map((it) => {
                    it.Date = tmr(it.Date)
                    return it
                  })
                )
              )
            ,
          ])
        }),
        map<[Route[], Route[]], Route[]>((it) => [...it[0], ...it[1]]),
        map((it) => {
            const d = new Date().getTime()
            return it.filter((it) => it.Date.getTime() > d)
          }
        ),
        switchMap((it)=>
          this.takeFirst.obs.pipe(
            map((num)=>it.slice(0, num))
          )
        )
      )
      .subscribe((it) =>
        this.routes.sub.next(it)
      )
  }


}
