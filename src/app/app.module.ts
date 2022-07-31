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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    FirstPageComponent,
    FerryScheduleComponent,
    BaseComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: "first-page", component: FirstPageComponent},
      {path: "ferry-schedule", component: FerryScheduleComponent},
      {path: "", redirectTo: "/ferry-schedule", pathMatch: "full"}
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
