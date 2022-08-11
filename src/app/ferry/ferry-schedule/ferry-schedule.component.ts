import {Component, OnInit} from '@angular/core';
import {NetworkService} from "../sun-ferry/network.service";
import {BaseComponent} from "../../base/base.component";
import {SearchPanelOutput} from "../search-panel/search-panel.component";
import {Route} from "../../search-panel/search-panel.service";

@Component({
  selector: 'app-ferry-schedule',
  templateUrl: './ferry-schedule.component.html',
  styleUrls: ['./ferry-schedule.component.css']
})
export class FerryScheduleComponent extends BaseComponent implements OnInit {



  searchResult(result: SearchPanelOutput) {
    this.schedule = result.schedule
    this.from = result.from
    this.to = result.to
    this.lane = result.lane

  }

  schedule: Route[] = []
  from: string = ""
  to: string = ""
  lane: string = ""

  constructor(networkService: NetworkService) {
    super(networkService)
  }
}
