import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../base/base.component";
import {SearchPanelOutput} from "../search-panel/search-panel.component";
import {Route, SearchPanelService} from "../../search-panel/search-panel.service";
import {RxServiceService} from "../../base/rxLib";
import obsd = RxServiceService.obsd;

@Component({
  selector: 'app-ferry-schedule',
  templateUrl: './ferry-schedule.component.html',
  styleUrls: ['./ferry-schedule.component.css']
})
export class FerryScheduleComponent extends BaseComponent implements OnInit {
  schedule = obsd<Route[]>([])

  constructor(private searchService: SearchPanelService) {
    super(searchService)
  }

  from: string = ""
  to: string = ""
  lane: string = ""

  searchResult(result: SearchPanelOutput) {
    this.from = result.from
    this.to = result.to
    this.lane = result.lane

    this.sub(
      this.searchService.getSchedule(
        SearchPanelService.toValue(this.lane),
        SearchPanelService.toValue(this.from),
        SearchPanelService.toValue(this.to),
        result.date
      )
        .subscribe((it) => {
          this.schedule.sub.next(it)
        })
    )

  }
}
