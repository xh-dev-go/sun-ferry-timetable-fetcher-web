import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FerryScheduleComponent } from './ferry-schedule.component';

describe('FerryScheduleComponent', () => {
  let component: FerryScheduleComponent;
  let fixture: ComponentFixture<FerryScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
