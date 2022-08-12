import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchPanelComponent, ToFrom} from './search-panel.component';
import {HttpClientModule} from "@angular/common/http";

describe('test ToFrom', ()=>{
  let arr = ["a","b","c","d"]
  it("",()=>{
    expect(ToFrom.empty().isEmpty()).toBe(true)
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).isEmpty()).toBe(false)
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).nonEmpty()).toBe(true)
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).from).toBe("a")
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).to).toBe("b")
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).switch().from).toBe("b")
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).switch().to).toBe("a")
    expect(()=>ToFrom.of(arr,arr[0],arr, arr[0]).to).toThrowError("From and To is the same")
    expect(()=>ToFrom.of(arr,arr[0],arr, arr[1]).updateFrom("x").from).toThrowError("from not contains")
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).updateFrom(arr[2]).to).toBe("b")
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).updateFrom(arr[2]).from).toBe("c")
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).updateFrom(arr[1]).to).toBe("a")
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).updateFrom(arr[1]).from).toBe("b")
    expect(()=>ToFrom.of(arr,arr[0],arr, arr[1]).updateTo("x").from).toThrowError("to not contains")
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).updateTo(arr[2]).to).toBe("c")
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).updateTo(arr[2]).from).toBe("a")
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).updateTo(arr[0]).to).toBe("a")
    expect(ToFrom.of(arr,arr[0],arr, arr[1]).updateTo(arr[0]).from).toBe("b")
  })
})
describe('SearchPanelComponent', () => {
  let component: SearchPanelComponent;
  let fixture: ComponentFixture<SearchPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule],
      declarations: [ SearchPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
