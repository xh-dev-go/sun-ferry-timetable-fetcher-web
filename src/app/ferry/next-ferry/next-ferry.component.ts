import {Component, OnInit} from '@angular/core';
import {SearchPanelOutput} from "../search-panel/search-panel.component";
import {RxServiceService} from "../../base/rx-service.service";
import obs = RxServiceService.obs;


@Component({
  selector: 'app-next-ferry',
  templateUrl: './next-ferry.component.html',
  styleUrls: ['./next-ferry.component.css'],
})
export class NextFerryComponent implements OnInit {
  constructor() {
  }

  searchOutput = obs<SearchPanelOutput>()


  ngOnInit(): void {
  }


}
