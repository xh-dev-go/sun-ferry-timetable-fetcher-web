import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {BaseService} from "./base.service";

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

  constructor() {
    super()
  }

  ngOnInit(): void {
    console.log("init - base")
  }

}
