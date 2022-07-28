import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {FirstPageComponent} from './first-page/first-page.component';
import {HttpClientModule} from "@angular/common/http";
import {FerryScheduleComponent} from './ferry/ferry-schedule/ferry-schedule.component';
import { BaseComponent } from './base/base.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    FirstPageComponent,
    FerryScheduleComponent,
    BaseComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: "first-page", component: FirstPageComponent},
      {path: "ferry-schedule", component: FerryScheduleComponent},
      {path: "", redirectTo: "/ferry-schedule", pathMatch: "full"}
    ]),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
