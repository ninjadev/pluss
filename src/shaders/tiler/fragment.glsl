varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float multiplier;

void main() {
    float x = mod(vUv.x * multiplier, 1.0);
    float y = mod(vUv.y * multiplier, 1.0);
    vec2 a = vec2(x, y);
    gl_FragColor = texture2D(tDiffuse, a);
}
