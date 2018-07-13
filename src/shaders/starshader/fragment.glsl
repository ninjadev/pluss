uniform float frame;
uniform sampler2D overlay;
uniform sampler2D underlay;

varying vec2 vUv;

void main() {
  vec4 overlay = texture2D(overlay, vUv);
  vec4 underlay = texture2D(underlay, vUv);
  
  if (overlay == vec4(0.)) {
      gl_FragColor = underlay;
  } else {
      gl_FragColor = overlay;
  }
}
