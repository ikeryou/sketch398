import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { TexLoader } from '../webgl/texLoader';
import { Param } from '../core/param';
import { Conf } from '../core/conf';
import { MatterjsMgr } from './matterjsMgr';
import { SpringItem } from './springItem';

export class Visual extends Canvas {

  private _matterjs: MatterjsMgr;
  private _con: Object3D
  private _item: Array<SpringItem> = []

  constructor(opt: any) {
    super(opt);

    this._matterjs = opt.matterjs;

    this._con = new Object3D();
    this.mainScene.add(this._con);

    for(let i = 0; i < this._matterjs.lineBodies.length; i++) {
      const t = TexLoader.instance.get(Conf.instance.PATH_IMG + 't.png');
      const item = new SpringItem(i, this._matterjs, t)
      this._con.add(item)
      this._item.push(item)
    }

    console.log(Param.instance.fps)
    this._resize();
  }


  protected _update(): void {
    super._update();

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.render(this.mainScene, this.cameraOrth);
  }


  public isNowRenderFrame(): boolean {
    return this.isRender
  }


  _resize(): void {
    super._resize();

    const w = Func.sw();
    const h = Func.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);

    this.cameraPers.fov = 80;
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();
  }
}
