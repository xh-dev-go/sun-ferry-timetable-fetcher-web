import {Component} from '@angular/core';
import {faFerry, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {BusyManService} from "./service/busy-man.service";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {NetworkService} from "./ferry/sun-ferry/network.service";
import {BaseService} from "./base/base.service";

export interface VersionResponse{
  version: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseService{
  title = 'web';
  faFerry = faFerry
  faSpinner = faSpinner
  feVersion = `${environment.version}-${environment.commitId}`
  beVersion = ""


  constructor(private busyManService: BusyManService, httpClient: HttpClient, networkService: NetworkService) {
    super()

    this.sub(
      httpClient.get<VersionResponse>(`${networkService.url}/v1/version`)
        .subscribe((it)=>
          this.beVersion = it.version
        )
    )
  }

  busyStatus = this.busyManService.getBusyStream()
    .pipe()
}
