import { Component } from '@angular/core';
import { faFerry, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {BusyManService} from "./service/busy-man.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'web';
  faFerry = faFerry
  faSpinner = faSpinner


  constructor(private busyManService: BusyManService) {
  }

  busyStatus = this.busyManService.getBusyStream()
    .pipe()
}
