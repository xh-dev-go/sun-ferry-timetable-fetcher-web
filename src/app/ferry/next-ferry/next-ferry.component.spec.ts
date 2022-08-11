import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextFerryComponent } from './next-ferry.component';
import {SearchPanelComponent} from "../search-panel/search-panel.component";
import {HttpClientModule} from "@angular/common/http";

describe('NextFerryComponent', () => {
  let component: NextFerryComponent;
  let fixture: ComponentFixture<NextFerryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule],
      declarations: [ NextFerryComponent, SearchPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextFerryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
