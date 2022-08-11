import {Component, OnDestroy, OnInit} from '@angular/core';
import {NetworkService} from "../ferry/sun-ferry/network.service";
import {Subscription} from "rxjs";
import {SearchPanelService} from "../search-panel/search-panel.service";

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css'],
  providers: [
    NetworkService
  ]
})
export class FirstPageComponent implements OnInit, OnDestroy {

  constructor(private searchPanelService: SearchPanelService) { }

  subs: Subscription[] = []
  map: Map<string,Map<string,string>> = new Map<string,Map<string,string>>()

  ngOnInit(): void {
    this.subs.push(this.searchPanelService.getServiceMap().subscribe(it=>{
      this.map = it
    }))
  }

  ngOnDestroy(): void {
    this.subs.map(it=>{
      if(!it.closed){
        it.unsubscribe()
      }
    })
  }

}
