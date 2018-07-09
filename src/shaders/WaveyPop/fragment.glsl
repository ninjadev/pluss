uniform float frame;
uniform float sync;
uniform float transition;
uniform float numBalls;

uniform sampler2D tDiffuse;

varying vec2 p;
float time = frame / 60.0;
float musicSync = sin(frame * 2. * acos(-1.) / 60. / 60. * 190.);

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float noise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

mat2 rotate(float a) {
    return mat2(-sin(a), cos(a),
                 cos(a), sin(a));
}

float pattern(vec2 p) {
    float r = 42424.;

    p *= rotate(0.75);
    p *= 5.5;

    vec2 rep = vec2(0.3 + sin(p.y) * 0.025 + sync, 0.75);

    float px = floor(p.x / rep.x);

    p.y += px * 0.5 * time;

    p = mod(p, rep);
    p -= rep * 0.5;


    r = max(abs(p.x) - 0.075, abs(p.y) - 0.25);

    return r  - musicSync * 0.075 ;
}

float dots(vec2 p) {
    p.y -= 1.75;

    float r = 22424.;

    vec2 rep = vec2(0.075);

    float py = floor(1. - p.y / rep.y) / 2000.;

    p = mod(p, rep);
    p -= rep * 0.5;

    r = length(p) - 0.005 - py * (1. - transition);

    return r;
}

float holes(vec2 p) {
    p += noise(vec3(p, time * 0.25));

    vec2 rep = vec2(0.5);
    p = mod(p, rep);
    p -= rep * 0.5;

    return length(p) - 0.05 - transition;
}

float cutout(vec2 p) {
    float r = 25252.;

    p.x += 0.25;
    p.y += 0.15;

    p.x += sin(p.y * 3. + time) * 0.015;

    r = max(abs(p.x) - 1.35, abs(p.y) - 0.65) + transition;

    p.x += sin(p.y * 2. + time);
    p.y += sin(p.y * 2.5 + time);

    vec2 rep = vec2(0.55, 0.55);
    float px = floor(p.x / rep.x);
    p.y += px * rep.y * 0.5;

    p = mod(p, rep);
    p -= rep * 0.5;

    float holes = length(p) - 0.25;

    holes = max(r + 0.05 + length(p), holes);

    r = max(r, -(holes));

    return r - musicSync * 0.065;
}

float balls(vec2 p) {
    vec2 q = p;


    p.x -= 0.5;
    p.y -= 0.25;

    p.x -= sin(p.y * 10. + time) * 0.02;

    float rep = 0.515;

    float py = floor(p.y / rep);

    p.y = mod(p.y, rep);
    p.y -= rep * 0.5;

    float r = length(p) - (0.25 - musicSync * 0.01) * (1. - transition);

    r = max(r, -(py - rep * 6.) - rep * numBalls);

    return r;
}

void main() {
    vec2 p = p;
    p = 2. * p - 1.;
    p.x *= 16. / 9.;

    vec3 col = vec3(p.y * 2., cos(time), cos(time));

    float pat = smoothstep(0., 0.01, pattern(p));
    float pat_shadow = smoothstep(0., 0.01, pattern(p - vec2(0.015, 0.)));

    float cut = smoothstep(0., 0.005, cutout(p));
    float cut_shadow = smoothstep(0., 0.025, cutout(p - vec2(0.075, -0.055)));

    float hole_shadow = smoothstep(0., 0.01, holes(p - vec2(0.01, -0.01)));
    float hole = smoothstep(0., 0.005, holes(p));

    float dots_pat = smoothstep(0., 0.005, dots(p));

    float ball_line = smoothstep(0., 0.005, balls(p));
    float ball_outline = smoothstep(0., 0.005, max(balls(p - vec2(0.01, -0.005)) - 0.001, -(balls(p))));

    col = (
        pat_shadow * pat * cut * cut_shadow * hole_shadow * ball_line * vec3(1., 0.15, 0.5) +
        (1. - pat) * cut * hole * ball_line * vec3(0.25, 1.0, 0.25) +
        (1. - cut) * ball_line * (p.x * 0.25 + 0.65) * vec3(0.5, (1. - p.x) * 0.85, 1.5) * 1.75 +
        (1. - hole) * cut * dots_pat * cut_shadow * ball_line +
        (1. - ball_line) * vec3(0.25, 1.0, 1.25) - (1. - ball_outline)
    );

    gl_FragColor = vec4(col, 1.0);
}
