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
    if(logoSample.b == 1.) {
      color = backgroundSample.xyz;
    } else if (logoSample.r == 1.) {
      color = patternSample.xyz;
    } else if(logoSample.g == 1.) {
      color = vec3(1., 0., 0.);
    } else {
      color = logoSample.xyz;
	  }
    //} else if(logoSample.a > 0.75) {
    //  color = vec3(1., 1., 0.);

    gl_FragColor = vec4(color , 1.);
}
