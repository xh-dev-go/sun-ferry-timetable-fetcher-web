import { TestBed } from '@angular/core/testing';

import { NetworkService } from './network.service';
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('NetworkService', () => {
  let service: NetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(NetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
