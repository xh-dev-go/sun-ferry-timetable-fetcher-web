import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Route} from "../../../search-panel/search-panel.service";
import {time} from "../../../base/timeLib";
import {interval, map, Subscription, timer} from "rxjs";
import CountDownTo = time.CountDownTo;
import {RxServiceService} from "pyyqww_t1/dist/rxlib/rxLib";
import obsd = RxServiceService.obsd;

@Component({
  selector: 'app-count-down-card',
  templateUrl: './count-down-card.component.html',
  styleUrls: ['./count-down-card.component.css']
})
export class CountDownCardComponent implements OnInit, OnDestroy {

  @Input()
  route: Route|null = null

  protected subscriptions: Subscription[] = []
  countDownStr = obsd<string>("")
  urgentStr = obsd<string>("")

  constructor() {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      timer(0, 1000).pipe(
        map((it)=>new CountDownTo(this.route?.Date!))
      )
        .subscribe(it=>{
          this.countDownStr.sub.next(it.format())

          if(it.days() === 0 && it.hours()=== 0 && it.minutes() < 10){
            this.urgentStr.sub.next("bg-secondary")
          } else  if(it.days() === 0 && it.hours()=== 0 && it.minutes() < 20){
            this.urgentStr.sub.next("bg-danger")
          } else  if(it.days() === 0 && it.hours()=== 0 && it.minutes() < 25){
            this.urgentStr.sub.next("bg-warning")
          } else  if(it.days() === 0 && it.hours()=== 0 && it.minutes() < 30){
            this.urgentStr.sub.next("bg-success")
          } else{
            this.urgentStr.sub.next("bg-primary")
          }
       })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(it=>it.unsubscribe())
  }



}
