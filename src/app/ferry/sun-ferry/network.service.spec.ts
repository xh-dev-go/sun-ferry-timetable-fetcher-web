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

  it('ToMap should', ()=>{
    var test: any = {
      a: {
        b: "c"
      },
      d: {
        e: "f"
      }
    }

    let m = NetworkService.toMap(test)
    expect(m.size).toBe(2)
    var sub = m.get("a") as Map<string, string>
    expect(sub.size).toBe(1)
    expect(sub.get("b")).toBe("c")

    var sub = m.get("d") as Map<string, string>
    expect(sub.size).toBe(1)
    expect(sub.get("e")).toBe("f")

  })
});
