uniform float frame;
uniform sampler2D tDiffuse;
uniform sampler2D logo;
uniform sampler2D patterns;
uniform sampler2D background;

varying vec2 vUv;

const vec3 white = vec3(1.0);
const vec3 blue = vec3(100./255., 186./255., 200./255.);
const vec3 pink = vec3(209./255., 103./255., 158./255.);
const vec3 green = vec3(116./255., 251./255., 201./255.);
const vec3 yellow = vec3(250./255., 231./255., 103./255.);

const float BEAT1 = 8184.0;
const float BEAT2 = 8216.0;
const float BEAT3 = 8292.0;
const float BEAT4 = 8336.0;
const float BEAT5 = 8363.0;
const float BEAT6 = 8395.0;

vec3 dv_gradient(float frame) {
  if (frame < BEAT2) {
    return white;
  } else if (frame < BEAT3) {
    float mixer = (frame - BEAT2) / 30.0;
    if (vUv.x < mixer) {
      return blue;
    } else {
      return white;
    }
  } else if (frame < BEAT4) {
    float mixer = (frame - BEAT3) / 30.0;
    if (vUv.x < mixer) {
      return pink;
    } else {
      return blue;
    }
  } else if (frame < BEAT5) {
    float mixer = (frame - BEAT4) / 30.0;
    if (vUv.x < mixer) {
      return yellow;
    } else {
      return pink;
    }
  } else if (frame < BEAT6) {
    float mixer = (frame - BEAT5) / 30.0;
    if (vUv.x < mixer) {
      return green;
    } else {
      return yellow;
    }
  } else {
    float index = mod(frame / 7.0, 5.0);
    if (index < 1.0) {
      return blue;
    } else if (index < 2.0) {
      return yellow;
    } else if (index < 3.0) {
      return pink;
    } else if (index < 4.0) {
      return green;
    } else {
      return white;
    }
  }
}

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
      color = dv_gradient(frame);
    } else {
      color = logoSample.xyz;
	  }

    gl_FragColor = vec4(color , 1.);
}
