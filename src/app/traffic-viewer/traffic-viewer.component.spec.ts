import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficViewerComponent } from './traffic-viewer.component';

describe('TrafficViewerComponent', () => {
  let component: TrafficViewerComponent;
  let fixture: ComponentFixture<TrafficViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
