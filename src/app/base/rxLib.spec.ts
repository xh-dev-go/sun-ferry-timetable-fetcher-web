import {RxServiceService} from './rxLib';
import obs = RxServiceService.obs;

describe('RxServiceService', () => {
  it("test obs", ()=>{
    const testStr = obs<string>()
    let msg = ""
    testStr.obs.pipe()


    testStr.sub.next("a")


  })
});
