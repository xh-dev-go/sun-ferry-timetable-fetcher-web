import {Component, OnInit} from '@angular/core';
import {NetworkService, Route} from "../sun-ferry/network.service";
import {BaseComponent} from "../../base/base.component";
import {BusyManService} from "../../service/busy-man.service";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {SearchPanelOutput} from "../search-panel/search-panel.component";

@Component({
  selector: 'app-ferry-schedule',
  templateUrl: './ferry-schedule.component.html',
  styleUrls: ['./ferry-schedule.component.css']
})
export class FerryScheduleComponent extends BaseComponent implements OnInit {

  faSpinner = faSpinner


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

  constructor(private networkService: NetworkService, private busyManService: BusyManService) {
    super()
  }

  busyStatus = this.busyManService.getBusyStream()
    .pipe()
}
