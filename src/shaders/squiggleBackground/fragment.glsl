uniform float frame;
uniform sampler2D tDiffuse;

#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

float triangle(float freq, float x){
    return abs(mod(x*freq, 1.0) * 3.0 - 2.0);
}

void main() {
    vec2 uv = vUv;
    float a = smoothstep(0.4, 0.6, triangle(10.0, uv.y + 0.2*sin(2.0*uv.x*PI)));
    //vec3 color = mix(vec3(.996, .984, 0.0), vec3(0.0, .741, .976), a);
    vec3 color = mix(vec3(1.0, 1.0, 1.0), vec3(0.0, .741, .976), max(0.8, a));

    gl_FragColor = vec4(color, 1.0);
}
