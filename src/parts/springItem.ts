import vt from '../glsl/hokan.vert';
import fg from '../glsl/hokan.frag';
import { MyObject3D } from '../webgl/myObject3D';
import { BaseItem } from './baseItem';
import { Mesh, PlaneGeometry, ShaderMaterial, SplineCurve, Texture, Vector2 } from 'three';
import { Util } from '../libs/util';
import { MatterjsMgr } from './matterjsMgr';
import { Func } from '../core/func';
import { Conf } from '../core/conf';

export class SpringItem extends MyObject3D {

  private _id: number
  private _matterjs: MatterjsMgr;
  private _mat: ShaderMaterial;
  private _left: BaseItem
  private _right: BaseItem
  private _hokan: Array<Mesh> = []
  private _hokanSize: number = 0.05

  constructor(id:number, matterjs: MatterjsMgr, t: Texture) {
    super();

    this._id = id
    this._matterjs = matterjs;

    this._left = new BaseItem(new Vector2(0.75, 1), t);
    this.add(this._left);

    this._right = new BaseItem(new Vector2(0, 0.25), t);
    this.add(this._right);

    const geo = new PlaneGeometry(1, this._hokanSize)
    this._mat = new ShaderMaterial({
      vertexShader: vt,
      fragmentShader: fg,
      transparent: true,
      depthTest: false,
      uniforms: {
        t: { value: t },
        center: { value: new Vector2(0.5, 0) },
      },
    })
    const num = 200
    for(let i = 0; i < num; i++) {
      const hokan = new Mesh(geo, this._mat)
      this.add(hokan)
      this._hokan.push(hokan)
    }
  }

  protected _update():void {
    super._update();

    const sw = Func.sw();
    const sh = Func.sh();
    const size = (sw / Conf.instance.ITEM_NUM) * 0.25

    this._left.scale.set(size, size, 1)
    this._right.scale.set(size, size, 1)

    const wave = Util.map(Math.sin(this._c * 0.05), -0.25, 0.25, -1, 1) * 0
    this._left.setMask(new Vector2(0.5 + wave, 1))
    this._right.setMask(new Vector2(0, 0.5 + wave))

    this._mat.uniforms.center.value.y = 0

    const curveArr: Array<Vector2> = []

    this._matterjs.lineBodies[this._id].forEach((body) => {
      curveArr.push(new Vector2(body.position.x - sw * 0.5, body.position.y * -1 + sh * 0.5))
    })
    const curve = new SplineCurve(curveArr)
    const points = curve.getPoints(this._hokan.length - 1)

    this._hokan.forEach((hokan, i) => {
      hokan.scale.set(size, size, 1)
      const hokanHeight = size * 0.05
      const p = points[i]
      if(p != undefined) {
        hokan.position.x = p.x
        hokan.position.y = p.y

        if(i != this._hokan.length - 1){
          const next = points[i + 1]
          const dx = next.x - p.x
          const dy = next.y - p.y
          hokan.rotation.z = Util.radian(Util.degree(Math.atan2(dy, dx)) + 90)

          if(i === 0) {
            this._left.position.x = hokan.position.x
            this._left.position.y = hokan.position.y + hokanHeight * 0

            this._left.rotation.z = hokan.rotation.z
            hokan.visible = false
          }
          if(i === this._hokan.length - 2) {
            this._right.position.x = hokan.position.x
            this._right.position.y = hokan.position.y - hokanHeight * 0

            this._right.rotation.z = hokan.rotation.z
            hokan.visible = false
          }
        } else {
          hokan.visible = false
        }
      }
    })
  }
}