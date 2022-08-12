import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {FirstPageComponent} from './first-page/first-page.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FerryScheduleComponent} from './ferry/ferry-schedule/ferry-schedule.component';
import {BaseComponent} from './base/base.component';
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpInterceptorService} from "./interceptor/http-interceptor.service";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SearchPanelComponent} from './ferry/search-panel/search-panel.component';
import {NextFerryComponent} from "./ferry/next-ferry/next-ferry.component";
import { CountDownCardComponent } from './ferry/next-ferry/count-down-card/count-down-card.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstPageComponent,
    FerryScheduleComponent,
    BaseComponent,
    NextFerryComponent,
    SearchPanelComponent,
    CountDownCardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: "first-page", component: FirstPageComponent},
      {path: "ferry-schedule", component: FerryScheduleComponent},
      {path: "next-ferry", component: NextFerryComponent},
      {path: "", redirectTo: "/next-ferry", pathMatch: "full"}
    ]),
    FormsModule,
    BrowserAnimationsModule,
    NgbModule,
    FontAwesomeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
