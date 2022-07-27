import {Component, OnInit} from '@angular/core';
import {NetworkService} from "../sun-ferry/network.service";
import {BaseComponent} from "../../base/base.component";
import {from, map, take} from "rxjs";

@Component({
  selector: 'app-ferry-schedule',
  templateUrl: './ferry-schedule.component.html',
  styleUrls: ['./ferry-schedule.component.css']
})
export class FerryScheduleComponent extends BaseComponent implements OnInit {
  routes: string[] = []
  selecting: string = ""
  lineOptions: string[]= []

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
          this.selecting = this.routes[0]
          this.subscriptions.push(
            from(this.networkService.getLineOptions(NetworkService.toDisplay(this.selecting)))
              .subscribe(it=>this.lineOptions = it)
          )
        })
    )
  }
}
