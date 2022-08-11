import {TestBed} from '@angular/core/testing';

import {SearchPanelService} from './search-panel.service';
import {HttpClientModule} from "@angular/common/http";

describe('SearchPanelService', () => {
  let service: SearchPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(SearchPanelService);
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

    let m = SearchPanelService.toMap(test)
    expect(m.size).toBe(2)
    var sub = m.get("a") as Map<string, string>
    expect(sub.size).toBe(1)
    expect(sub.get("b")).toBe("c")

    var sub = m.get("d") as Map<string, string>
    expect(sub.size).toBe(1)
    expect(sub.get("e")).toBe("f")

  })
});
