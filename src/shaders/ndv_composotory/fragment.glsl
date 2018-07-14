uniform float frame;
uniform sampler2D tDiffuse;
uniform sampler2D logo;
uniform sampler2D patterns;

varying vec2 vUv;

void main() {
    vec4 logoSample = texture2D(logo, vUv);
    vec4 patternSample = texture2D(patterns, vUv);
    vec3 color = vec3(0.);
    if(logoSample.x < 0.25) {
      color = patternSample.xyz;
    } else if(logoSample.x < 0.75) {
      color = vec3(1., 0., 0.);
    } else if(logoSample.x > 0.75) {
      color = vec3(1., 1., 0.);
   }
    gl_FragColor = vec4(color * logoSample.a, 1.);
}
