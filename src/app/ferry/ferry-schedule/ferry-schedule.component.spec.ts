import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FerryScheduleComponent } from './ferry-schedule.component';
import {NetworkService} from "../sun-ferry/network.service";
import {HttpClientModule} from "@angular/common/http";

describe('FerryScheduleComponent', () => {
  let component: FerryScheduleComponent;
  let fixture: ComponentFixture<FerryScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ FerryScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FerryScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
