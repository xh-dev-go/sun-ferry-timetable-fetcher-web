import {TestBed} from '@angular/core/testing';

import {BusyManService} from './busy-man.service';

describe('BusyManService', () => {
  let service: BusyManService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusyManService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
