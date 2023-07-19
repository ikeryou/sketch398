uniform sampler2D t;
uniform vec2 mask;

varying vec2 vUv;

void main(void) {
  vec2 uv = vUv;
  if(mask.x > 0.5 && mask.x > uv.y) {
    uv.y = mask.x;
  }

  vec4 dest = texture2D(t, uv);
  dest.a *= step(0.5, vUv.y);

  // dest.rgb = vec3(0.0);

  gl_FragColor = dest;
}
