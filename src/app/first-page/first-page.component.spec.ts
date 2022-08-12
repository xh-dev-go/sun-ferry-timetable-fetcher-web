import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FirstPageComponent} from './first-page.component';
import {HttpClientModule} from "@angular/common/http";

describe('FirstPageComponent', () => {
  let component: FirstPageComponent;
  let fixture: ComponentFixture<FirstPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      declarations: [ FirstPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
