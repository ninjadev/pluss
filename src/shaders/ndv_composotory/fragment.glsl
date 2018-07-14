uniform float frame;
uniform sampler2D tDiffuse;
uniform sampler2D logo;
uniform sampler2D patterns;
uniform sampler2D background;

varying vec2 vUv;

void main() {
    vec4 logoSample = texture2D(logo, vUv);
    vec4 patternSample = texture2D(patterns, vUv);
    vec4 backgroundSample = texture2D(background, vUv);

    vec3 color = vec3(0.);
    if(logoSample.a < 0.25) {
      color = backgroundSample.xyz;
    } else if (logoSample.a < 0.50) {
      color = patternSample.xyz;
    } else {
      color = logoSample.xyz;
    }
    //} else if(logoSample.a < 0.75) {
    //  color = vec3(1., 0., 0.);
    //} else if(logoSample.a > 0.75) {
    //  color = vec3(1., 1., 0.);

    gl_FragColor = vec4(color , 1.);
}
