import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseService} from "./base.service";
import {NetworkService} from "../ferry/sun-ferry/network.service";

@Component({
  selector: 'app-base',
  template: `
    <p>
      base works!
    </p>
  `,
  styles: []
})
export class BaseComponent extends BaseService implements OnInit, OnDestroy {

  baseUrl():string {
    return `${this.networkService.url}`
  }
  constructor(private networkService: NetworkService) {
    super()
  }

  ngOnInit(): void {
    console.log("init - base")
  }

}
