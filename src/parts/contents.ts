import { MyDisplay } from "../core/myDisplay";
import { MatterjsMgr } from "./matterjsMgr";
import { Visual } from "./visual";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  constructor(opt:any) {
    super(opt)

    const m = new MatterjsMgr()

    new Visual({
      el: document.querySelector('.l-canvas'),
      matterjs: m,
      transparent: true,
    })
  }
}