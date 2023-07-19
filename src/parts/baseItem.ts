import vt from '../glsl/baseItem.vert';
import fgTop from '../glsl/baseItemTop.frag';
import fgBtm from '../glsl/baseItemBtm.frag';
import { Mesh, PlaneGeometry, ShaderMaterial, Texture, Vector2 } from 'three';
import { MyObject3D } from '../webgl/myObject3D';

export class BaseItem extends MyObject3D {

  // private _id: number
  private _mesh: Mesh;

  constructor(mask: Vector2, tex: Texture) {
    super();

    this._mesh = new Mesh(
      new PlaneGeometry(1, 1),
      new ShaderMaterial({
        vertexShader:vt,
        fragmentShader: mask.x >= 0.5 ? fgTop : fgBtm,
        transparent: true,
        depthTest: false,
        uniforms: {
          t: { value: tex },
          mask: { value: mask },
        },
      })
    );
    this.add(this._mesh);
    // this._mesh.position.y = -0.3
  }

  public setMask(v: Vector2):void {
    (this._mesh.material as ShaderMaterial).uniforms.mask.value = v
  }

  protected _update():void {
    super._update();
  }
}