import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextFerryComponent } from './next-ferry.component';

describe('NextFerryComponent', () => {
  let component: NextFerryComponent;
  let fixture: ComponentFixture<NextFerryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextFerryComponent ]
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
