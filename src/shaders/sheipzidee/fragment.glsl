#define AA 2
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform float frame;
varying vec2 vUv;

float sdCylinder(vec3 p, vec3 c) {
      return length(p.xz - c.xy) - c.z;
}

float sdSphere( in vec3 p, in vec4 s ) {
    return length(p-s.xyz) - s.w;
}

float sdEllipsoid( in vec3 p, in vec3 c, in vec3 r ) {
    return (length( (p-c)/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

float sdBox( vec3 p, vec3 b ) {
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdPyramid4(vec3 p, vec3 h ) // h = { cos a, sin a, height }
{
    // Tetrahedron = Octahedron - Cube
    float box = sdBox( p - vec3(0,-2.0*h.z,0), vec3(2.0*h.z) );

    float d = 0.0;
    d = max( d, abs( dot(p, vec3( -h.x, h.y, 0 )) ));
    d = max( d, abs( dot(p, vec3(  h.x, h.y, 0 )) ));
    d = max( d, abs( dot(p, vec3(  0, h.y, h.x )) ));
    d = max( d, abs( dot(p, vec3(  0, h.y,-h.x )) ));
    float octa = d - h.z;
    return max(-box,octa); // Subtraction
}

mat3 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(1, 0, 0),
        vec3(0, c, -s),
        vec3(0, s, c));
}

mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c));
}

mat3 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, -s, 0),
        vec3(s, c, 0),
        vec3(0, 0, 1));
}

// http://research.microsoft.com/en-us/um/people/hoppe/ravg.pdf
float det( vec2 a, vec2 b ) { return a.x*b.y-b.x*a.y; }
vec3 getClosest( vec2 b0, vec2 b1, vec2 b2 ) {
    float a = det(b0, b2);
    float b = 2.0*det(b1, b0);
    float d = 2.0*det(b2, b1);
    float f = b * d - a * a;
    vec2 d21 = b2 - b1;
    vec2 d10 = b1 - b0;
    vec2 d20 = b2 - b0;
    vec2 gf = 2. * (b * d21 + d * d10 + a * d20);
    gf = vec2(gf.y, -gf.x);
    vec2 pp = -f * gf / dot(gf, gf);
    vec2 d0p = b0 - pp;
    float ap = det(d0p, d20);
    float bp = 2.0 * det(d10, d0p);
    float t = clamp((ap + bp) / (2.0 * a + b + d), 0.0, 1.0);
    return vec3(mix(mix(b0, b1, t), mix(b1, b2, t), t), t);
}

float hash1( float n ) {
    return fract(sin(n) * 43758.5453123);
}

vec3 forwardSF( float i, float n)  {
    const float PI = 3.141592653589793238;
    const float PHI = 1.618033988749894848;
    float phi = 2.0 * PI * fract(i / PHI);
    float zi = 1.0 - (2.0 * i + 1.0) / n;
    float sinTheta = sqrt(1.0 - zi * zi);
    return vec3( cos(phi) * sinTheta, sin(phi) * sinTheta, zi);
}

const float pi = 3.1415927;


vec2 map(vec3 p) {
    vec3 boxPoint = rotateZ(-pi / 4.) * (p + vec3(1.25, 0., 0.));
    float box = sdBox(boxPoint, vec3(1., 3., 1.) / 6.);
    float sphere = sdSphere(p, vec4(0., 0., 0., .5));
    float angle = 60. / 180. * pi;
    float triangle = sdPyramid4(p + vec3(-1.25, .5, 0.), vec3(sin(angle), cos(angle), .5)); 
    float shapes = min(min(triangle, box), sphere); 
    float ground = 9999999.;

    if(frame > 3713.5 - 76.) {
        float spacing = 0.15;
        shapes = max(shapes, -sdBox(p, vec3(10., spacing / 4., 10.)));
        shapes = max(shapes, -sdBox(p + vec3(0., spacing, 0.), vec3(10., spacing / 4., 10.)));
        shapes = max(shapes, -sdBox(p + vec3(0., -spacing, 0.), vec3(10., spacing / 4., 10.)));
    } else if(frame > 3522.5 - 76.) {
        ground = min(sdCylinder(p, vec3(-1.25, 0., .1)), min(sdCylinder(p, vec3(0., 0., .1)), sdCylinder(p, vec3(1.25, 0., .1))));
    } else {
        ground = sdBox(p + vec3(0., 10.5, 0.), vec3(20., 10., 1.));
    }

    vec2 shapes_ = vec2(shapes, 1.);
    vec2 ground_ = vec2(ground, 2.);

    vec2 result;
    if(shapes_.x < ground_.x) {
        result = shapes_;
    } else {
        result = ground_;
    }

    return result;
}

vec3 calcNormal(in vec3 pos, in float eps ) {
    vec2 e = vec2(1.0, -1.0) * 0.5773 * eps;
    return normalize( e.xyy*map( pos + e.xyy).x + 
                      e.yyx*map( pos + e.yyx).x + 
                      e.yxy*map( pos + e.yxy).x + 
                      e.xxx*map( pos + e.xxx).x );
}


float calcAO(in vec3 pos, in vec3 nor) {
    float ao = 0.0;
    for(int i=0; i < 32; i++) {
        vec3 ap = forwardSF(float(i), 32.);
        float h = hash1(float(i));
        ap *= sign(dot(ap,nor)) * h * .1;
        ao += clamp(map(pos + nor * 0.01 + ap).x * 3., 0., 1.);
    }
    ao /= 32.;
    
    return clamp(ao * 6., 0., 1.);
}

float calcSSS(in vec3 pos, in vec3 nor) {
    float occ = 0.;
    for(int i = 0; i < 8; i++) {
        float h = 0.002 + 0.11 * float(i) / 7.;
        vec3 dir = normalize(sin(float(i) * 13.0 + vec3(0., 2.1, 4.2)));
        dir *= sign(dot(dir, nor));
        occ += (h - map(pos - h * dir).x);
    }
    occ = clamp(1. - 11. * occ / 8., 0., 1.);    
    return occ * occ;
}

float calcSoftShadow(in vec3 ro, in vec3 rd, float k) { 
    float res = 1.0;
    float t = 0.01;
    for(int i = 0; i < 32; i++) {
        float h = map(ro + rd * t).x;
        res = min(res, smoothstep(0., 1.,k * h / t));
        t += clamp(h, .04, .1);
        if(res < .01) {
            break;
        }
    }
    return clamp(res, 0., 1.);
}

vec3 sunDir = normalize(vec3(.2, .1, .02));

vec3 shade(in vec3 ro, in vec3 rd, in float t, in float m) {
    float eps = .002;
    
    vec3 pos = ro + t * rd;
    vec3 nor = calcNormal(pos, eps);

    /* diffuse ? */
    vec3 mateD = vec3(0.);
    /* specular ? */
    vec3 mateS = vec3(0.);
    /* k */
    vec2 mateK = vec2(0.);
    /* emissive ? */
    vec3 mateE = vec3(0.);

    float focc = 1.0;
    float fsha = 1.;

    vec3 green = vec3(14., 92., 73.) / 255.;
    vec3 yellow = vec3(255., 252., 0.) / 255.;

    if(m < 1.5) {
        float dis = texture2D( iChannel1, 5.0*pos.xy ).x;

        float be = sdEllipsoid( pos, vec3(-0.3,-0.5,-0.1), vec3(0.2,1.0,0.5) );
        be = 1.0-smoothstep( -0.01, 0.01, be );        
        
        float ff = 0.2;
        
        mateS = 6.0*mix( 0.7*vec3(2.0,1.2,0.2), vec3(2.5,1.8,0.9), ff );
        mateS += 2.0*dis;
        mateS *= 1.5;
        mateS *= 1.0 + 0.5*ff*ff;
        mateS *= 1.0-0.5*be;
        
        mateD = vec3(1.0,0.8,0.4);
        mateD *= dis;
        mateD *= 0.015;
        mateD += vec3(0.8,0.4,0.3)*0.15*be;
        
        mateK = vec2( 60.0, 0.7 + 2.0*dis );
        
        float f = clamp( dot( -rd, nor ), 0.0, 1.0 );
        f = 1.0-pow( f, 8.0 );
        f = 1.0 - (1.0-f)*(1.0-texture2D( iChannel2, 0.3*pos.xy ).x);
        mateS *= vec3(0.5,0.1,0.0) + f*vec3(0.5,0.9,1.0);
        
        float b = 1.0-smoothstep( 0.25,0.55,abs(pos.y));
        focc = 0.2 + 0.8*smoothstep( 0.0, 0.15, sdSphere(pos,vec4(0.05,0.52,0.0,0.13)) );
    } else if (m < 2.5) {
        float dis = texture2D(iChannel1, 5.0*pos.xy ).x;

        float be = sdEllipsoid( pos, vec3(-0.3,-0.5,-0.1), vec3(0.2,1.0,0.5) );
        be = 1.0-smoothstep( -0.01, 0.01, be );        
        
        float ff = 0.2;
        
        mateS = 6.0*mix( 0.7*vec3(2.0,1.2,0.2), vec3(2.5,1.8,0.9), ff );
        mateS += 2.0*dis;
        mateS *= 1.5;
        mateS *= 1.0 + 0.5*ff*ff;
        mateS *= 1.0-0.5*be;

        mateS = green;
        
        mateD = vec3(1.0,0.8,0.4);
        mateD *= dis;
        mateD *= 0.015;
        mateD += vec3(0.8,0.4,0.3)*0.15*be;

        mateD = vec3(1.);
        
        mateK = vec2( 60.0, 0.7 + 2.0*dis );
        
        mateK = vec2(0.);

        float f = clamp( dot( -rd, nor ), 0.0, 1.0 );
        f = 1.0-pow( f, 8.0 );
        f = 1.0 - (1.0-f)*(1.0-texture2D( iChannel2, 0.3*pos.xy ).x);
        mateS *= vec3(0.5,0.1,0.0) + f*vec3(0.5,0.9,1.0);
        
        float b = 1.0-smoothstep( 0.25,0.55,abs(pos.y));
        focc = 0.2 + 0.8*smoothstep( 0.0, 0.15, sdSphere(pos,vec4(0.05,0.52,0.0,0.13)) );

    }
  
    vec3 hal = normalize( sunDir-rd );
    float fre = clamp(1.0+dot(nor,rd), 0.0, 1.0 );
    float occ = calcAO( pos, nor )*focc;
    float sss = calcSSS( pos, nor );
    sss = sss*occ + fre*occ + (0.5+0.5*fre)*pow(abs(-0.2),1.0)*occ;
    
    float dif1 = clamp( dot(nor,sunDir), 0.0, 1.0 );
    float sha = calcSoftShadow( pos, sunDir, 20.0 ); 
    dif1 *= sha*fsha;
    float spe1 = clamp( dot(nor,hal), 0.0, 1.0 );

    float bou = clamp( 0.3-0.7*nor.y, 0.0, 1.0 );


    // illumination
    
    vec3 col = vec3(0.0);
    col += 7.0*vec3(1.7,1.2,0.6)*dif1*2.0;           // sun
    col += 4.0*vec3(0.2,1.2,1.6)*occ*(0.5+0.5*nor.y);    // sky
    col += 1.8*vec3(0.1,2.0,0.1)*bou*occ;                // bounce

    col *= mateD;


    if(m > 1.5) {
        col = dif1 * green;
        col = vec3(0.);
    } else if(m > 0.5) {
        col = dif1 * yellow;
    }


    col += .4*sss*(vec3(0.15,0.1,0.05)+vec3(0.85,0.9,0.95)*dif1)*(0.05+0.95*occ)*mateS; // sss
    col = pow(col,vec3(0.6,0.8,1.0));
    
    col += vec3(1.0,1.0,1.0)*0.2*pow( spe1, 1.0+mateK.x )*dif1*(0.04+0.96*pow(fre,4.0))*mateK.x*mateK.y;   // sun lobe1
    col += vec3(1.0,1.0,1.0)*0.1*pow( spe1, 1.0+mateK.x/3.0 )*dif1*(0.1+0.9*pow(fre,4.0))*mateK.x*mateK.y; // sun lobe2
    col += 0.1*vec3(1.0,max(1.5-0.7*col.y,0.0),2.0)*occ*occ*smoothstep( 0.0, 0.3, reflect( rd, nor ).y )*mateK.x*mateK.y*(0.04+0.96*pow(fre,5.0)); // sky

    col += mateE;

    return col;        
}


vec2 intersect(in vec3 ro, in vec3 rd, const float mindist, const float maxdist) {
    vec2 res = vec2(-1.0);
    
    float t = mindist;
    for(int i = 0; i < 256; i++) {
        vec3 p = ro + t*rd;
        vec2 h = map(p);
        res = vec2(t,h.y);

        if( h.x<(0.001*t) ||  t>maxdist ) break;
        
        t += h.x*0.9;
    }
    return res;
}


vec3 render(in vec3 ro, in vec3 rd, in vec2 q) {
    vec3 col = vec3(255., 155., 189.) / 255.;
    if(frame > 3636.5) {
        col = mix(vec3(1.), vec3(0.), sign(sin(rd.x * 40.)));
    }
    float mindist = 0.01;
    float maxdist = 40.0;

    vec2 tm = intersect(ro, rd, mindist, maxdist);
    if( tm.y>-0.5 && tm.x < maxdist ) {
        col = shade(ro, rd, tm.x, tm.y);
        maxdist = tm.x;
    }
    
    float sun = clamp(dot(rd,sunDir),0.0,1.0);
    col += 1.0*vec3(1.5,0.8,0.7)*pow(sun,4.0);
    col = pow( col, vec3(0.45) );
    col = mix(col, vec3(1.05,1.0,1.0)*col*(0.7+0.3*col*(3.0-2.0*col)) + vec3(0.0,0.0,0.04), 0.5);
    col *= 0.3 + 0.7*pow(16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y),0.1);
    return clamp( col, 0.0, 1.0 );
}

mat3 setCamera(in vec3 ro, in vec3 rt, in float cr) {
    vec3 cw = normalize(rt-ro);
    vec3 cp = vec3(sin(cr), cos(cr),0.0);
    vec3 cu = normalize( cross(cw,cp) );
    vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, -cw );
}

void main() {
    vec3 col = vec3(1.);
    vec2 iResolution = vec2(1920., 1080.);
    vec2 fragCoord = iResolution * vUv;
    float iTime = frame / 60.;

    float angle = (frame - 3926.) / 20.;
    float radius = 4.2;
    float height = 0.;
    float targetHeight = 0.;

    float letterbox = 0.119;
    if(vUv.y < letterbox || vUv.y > 1. - letterbox) {
        gl_FragColor = vec4(vec3(93., 28., 53.) / 255., 1.);
        return;
    }
    if(frame > 3636.5) {
        angle = -18.6 + frame / 200.;
        radius = 3.8;
        height = .25;
    } else if(frame > 3459.5) {
        angle = -14.3 + frame / 60.;
        radius = 5.;
        height = -1. + mix(0., 2., (frame - 3459.) / 60.);
    } else if(frame > 3446.5) {
        angle = -5.5 + frame / 100.;
        radius = 3.;
        height = -.1;
    } else if(frame > 3307.5) {
        radius = 8.;
        angle = -7.3 - frame / 60.;
        height = 3.5;
        targetHeight = .5;
    }

    for(int m = 0; m < 2; m++) {
        for( int n = 0; n < 2; n++) {
            vec2 rr = vec2(float(m), float(n)) / float(AA);

            vec2 p = (-iResolution.xy + 2.0 * (fragCoord.xy + rr)) / iResolution.y;

            vec2 q = (fragCoord.xy+rr) / iResolution.xy;

            vec3 ro = vec3(radius * sin(angle), height, radius * cos(angle));
            vec3 ta = vec3(.0, targetHeight, 0.);
            mat3 ca = setCamera(ro, ta, 0.);
            vec3 rd = normalize(ca * vec3(p, -2.8));

            col += render(ro, rd, q);
        }
    }
    col /= 5.;
    gl_FragColor = vec4(col, 1.0);
}
