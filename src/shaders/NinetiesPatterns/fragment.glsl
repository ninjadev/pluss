varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float frame;
uniform float patternSize;
uniform float patternSpeed;
uniform float effectNum;

float time = frame / 60.;

//
// Tools
//

float rmin(float a, float b, float r) {
    vec2 u = max(vec2(r - a,r - b), vec2(0));
    return max(r, min (a, b)) - length(u);
}

mat2 rotate(float a) {
    return mat2(-sin(a), cos(a),
                 cos(a), sin(a));
}

float hash(vec2 p){
    return fract(sin(dot(p,vec2(12.9898,78.233))) * 43758.5453);
}

float hash(float posh){
    vec2 p = vec2(posh);
    return fract(sin(dot(p,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 hash3( vec2 p ){
    vec3 q = vec3( dot(p,vec2(127.1,311.7)),
           dot(p,vec2(269.5,183.3)),
           dot(p,vec2(419.2,371.9)) );
  return fract(sin(q)*43758.5453);
}

float voronoise( in vec2 x, float u, float v ){
    vec2 p = floor(x);
    vec2 f = fract(x);

  float k = 1.0+63.0*pow(1.0-v,4.0);

  float va = 0.0;
  float wt = 0.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        vec2 g = vec2( float(i),float(j) );
    vec3 o = hash3( p + g )*vec3(u,u,1.0);
    vec2 r = g - f + o.xy;
    float d = dot(r,r);
    float ww = pow( 1.0-smoothstep(0.0,1.414,sqrt(d)), k );
    va += o.z*ww;
    wt += ww;
    }

    return va/wt;
}


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


//
// CRAZY MTV PATTERN
//

vec3 crazyMtvPattern(vec2 p) {
    float size = patternSize;

    float yellow = voronoise(p * 80. * size, -1.5, 1.) - 0.5;
    float yellow_border = max(yellow, -(yellow + 0.15));
    yellow_border = smoothstep(0., 0.01, yellow_border);
    yellow = smoothstep(0., 0.01, yellow);

    float orange = voronoise(p * 80. * size + 50., -1.2, 1.) - 0.5;
    float orange_border = max(orange, -(orange + 0.1));
    orange_border = smoothstep(0., 0.01, orange_border);

    orange = smoothstep(0., 0.01, orange);

    float purple = voronoise(p * 20. * size + 200., -2.6, 1.) - 0.5;
    purple = smoothstep(0., 0.01, purple);

    return (
        vec3(1., 0.6, 0.05) * (1. - yellow) * yellow_border * purple  * orange_border +
        vec3(0.4, 0., 0.4) * (1. - purple) * orange * yellow_border * yellow * orange_border +
        vec3(1., 1., 0.) * (1. - orange) * yellow_border * yellow * orange_border +
        vec3(1.) * (1. - orange_border)

    );
}


//
// GEOPARD PATTERN
//

vec3 geopardPattern(vec2 p) {
    float size = patternSize;

    float geopard = voronoise(p * 200. * size, 0.9, 1.) - 0.35;
    geopard = smoothstep(0., 0.025, geopard);

    float geopard_shadow = voronoise(p * 200. * size - vec2(1.25 * size), 0.9, 1.) - 0.35;
    geopard_shadow = smoothstep(0., 0.025, geopard_shadow);

    float shade = noise(vec3(p * 0.5, 9.)) * 0.5;

    return (
        vec3(1., 0.05 + (p.y + 0.5) * 0.2, 0. + shade) * geopard +
        vec3(0.015, 0.20 - shade * 0.4, 0.15 + abs(p.x) * 0.05) * (1. - geopard)
        - (1. - geopard_shadow) * 0.215
    );
}

//
// ZEBRA PATTERN
//
vec3 zebraPattern(vec2 p) {
    p *= patternSize * 7.5;

    vec2 q = p;
    p += noise(vec3(p + time * 0.01, 2.75));

    float rep = 0.1;
    p.y = mod(p.y, rep);
    p.y -= 0.5 * rep;

    float zebra = abs(p.y) - 0.01;
    zebra = smoothstep(0.0, 0.015, zebra);

    float zebra_shadow = abs(p.y) - 0.01;
    zebra_shadow = smoothstep(0.0, 0.05, zebra_shadow);

    return 1.35 - (
        vec3(0.15 + q.y * 0.4 + 0.25, 1. + q.x * 0.15, 0.5 + p.x * 0.25) * zebra +
        vec3(1., 0.25, 0.25) * (1. - zebra)
        + (1. - zebra_shadow) * 0.2
    );
}


//
// BANANA PATTERN
//
float banana_body(vec2 p, float size) {
    float r = length(p) - size;
    r = max(r, -(length(p - vec2(size * 0.3)) - size));
    r = max(r, length(p - vec2(-size * 0.25)) - size);

    return r;
}

float banana_head_butt(vec2 p, float size) {
    float r = length(p) - size;
    r = max(r, -(length(p - vec2(size * 0.3)) - size));
    r = max(r, -(length(p - vec2(-size * 0.25)) - size));
    r = rmin(r, max(abs(p.x + size * 0.5) - 0.015 * size, abs(p.y - size * 0.9) - 0.1 * size), 0.275 * size);
    r = rmin(r, max(abs(p.x - size * 0.75), abs(p.y + size * 0.6)), 0.225 * size);

    return r;
}

vec3 bananaPattern(vec2 p) {
    float size = patternSize;

    p -= time * patternSpeed;

    // Repeat
    vec2 rep = vec2(size * 2.75);
    float px = floor(p.x / rep.x);
    p.y += px * rep.y * 0.5;
    p = mod(p, rep);
    p -= rep * 0.5;

    // Objects
    float banana_bodies = smoothstep(0., 0.01, banana_body(p, size));
    float banana_head_butts = smoothstep(0., 0.01, banana_head_butt(p, size));

    // Bodies
    float banana_bodies_shadow = smoothstep(0., 0.01, banana_body(p - vec2(0.2 * size), size));

    float bg = banana_bodies * banana_head_butts;

    return (
        vec3(0.35, 0.75, 1.) * bg +
        vec3(1., 1., 0.) * (1. - banana_bodies) +
        vec3(0.5, 0.3, 0.15) * (1. - banana_head_butts)
    ) - (
        vec3(0.8, 0., 0.) * banana_bodies_shadow
    );
}

void main() {
    vec2 p = vUv;
    p = 2. * p - 1.;
    p.x *= 16. / 9.;


    vec3 currentPattern = vec3(0.5, 1., 0.5);

    if (effectNum == 0.0) {
        currentPattern = bananaPattern(p);
    }
    else if (effectNum == 1.0) {
        currentPattern = zebraPattern(p);
    }
    else if (effectNum == 2.0) {
        currentPattern = geopardPattern(p);
    }
    else if (effectNum == 3.0) {
        currentPattern = crazyMtvPattern(p);
    }

    gl_FragColor = vec4(currentPattern, 0.);
}
