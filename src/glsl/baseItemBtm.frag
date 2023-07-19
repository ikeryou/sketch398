uniform sampler2D t;
uniform vec2 mask;

varying vec2 vUv;

void main(void) {
  vec2 uv = vUv;
  if(uv.y > mask.y) {
    uv.y = mask.y;
  }

  vec4 dest = texture2D(t, uv);
  dest.a *= 1.0 - step(0.5, vUv.y);

  gl_FragColor = dest;
}
