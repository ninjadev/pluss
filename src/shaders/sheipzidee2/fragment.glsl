#define AA 2
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform float frame;
uniform float exitAmount;
uniform float exitAmount2;
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


float smin(float a, float b) {
    float k = 4.;
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}


vec2 map(vec3 p, float frame) {
    float a1 = -frame / 60. / 60. * 190. / 4. / 5. * pi * 2. + 1. / 5. * pi * 2.;
    float a2 = -frame / 60. / 60. * 190. / 4. / 5. * pi * 2. + 2. / 5. * pi * 2.;
    float a3 = -frame / 60. / 60. * 190. / 4. / 5. * pi * 2. + 3. / 5. * pi * 2.;
    float a4 = -frame / 60. / 60. * 190. / 4. / 5. * pi * 2. + 4. / 5. * pi * 2.;
    float a5 = -frame / 60. / 60. * 190. / 4. / 5. * pi * 2. + 5. / 5. * pi * 2.;
    float r1 = -cos(1. / 5. - frame / 60. / 60. * 190. / 4. * pi * 2.) * 2. * (1. - exitAmount);
    float r2 = -cos(2. / 5. - frame / 60. / 60. * 190. / 4. * pi * 2.) * 2. * (1. - exitAmount);
    float r3 = -cos(3. / 5. - frame / 60. / 60. * 190. / 4. * pi * 2.) * 2. * (1. - exitAmount);
    float r4 = -cos(4. / 5. - frame / 60. / 60. * 190. / 4. * pi * 2.) * 2. * (1. - exitAmount);
    float r5 = -cos(5. / 5. - frame / 60. / 60. * 190. / 4. * pi * 2.) * 2. * (1. - exitAmount);


    p = p + vec3(0., mix(0., -.5, exitAmount), mix(0., -4., exitAmount));
    float s1;
    float s2;
    float s3;
    float s4;
    float s5;
    if(frame >= 4091.5) {
        s1 = sdBox(p + vec3(1.44 * r1 * sin(a1), 1.44 * r1 * cos(a1), 0.), vec3(.75 * (1. - exitAmount)));
        s2 = sdBox(p + vec3(1.44 * r2 * sin(a2), 1.44 * r2 * cos(a2), 0.), vec3(.75 * (1. - exitAmount)));
        s3 = sdBox(p + vec3(1.44 * r3 * sin(a3), 1.44 * r3 * cos(a3), 0.), vec3(.75 * (1. - exitAmount)));
        s4 = sdBox(p + vec3(1.44 * r4 * sin(a4), 1.44 * r4 * cos(a4), 0.), vec3(.75 * (1. - exitAmount)));
        s5 = sdBox(p + vec3(2. * r5 * sin(a5), 2. * r5 * cos(a5), 0.), vec3(.75 * (1. - exitAmount)));
    } else {
        s1 = sdSphere(p, vec4(r1 * sin(a1), r1 * cos(a1), 0., .75 * (1. - exitAmount)));
        s2 = sdSphere(p, vec4(r2 * sin(a2), r2 * cos(a2), 0., .75 * (1. - exitAmount)));
        s3 = sdSphere(p, vec4(r3 * sin(a3), r3 * cos(a3), 0., .75 * (1. - exitAmount)));
        s4 = sdSphere(p, vec4(r4 * sin(a4), r4 * cos(a4), 0., .75 * (1. - exitAmount)));
        s5 = sdSphere(p, vec4(r5 * sin(a5), r5 * cos(a5), 0., .75 * (1. - exitAmount)));
    }

    float shapes = smin(smin(smin(smin(s1, s2), s3), s4), s5);

    float rotateAmount = 1.2;
    vec3 boxP = rotateY(pi / 4. * rotateAmount) * rotateX(pi / 4. * rotateAmount) * p;
    float box = sdBox(boxP, vec3(exitAmount));
    float topSubtract = sdBox(rotateZ(pi / 32.) * (p + vec3(0., -mix(3., 10.5, exitAmount), 0.)), vec3(5., 10. * exitAmount, 5.));
    float triangle = max(smin(box, shapes), -topSubtract);
    return vec2(triangle, 1.);
}

vec3 calcNormal(in vec3 pos, in float eps, in float frame) {
    vec2 e = vec2(1.0, -1.0) * 0.5773 * eps;
    return normalize( e.xyy*map(pos + e.xyy, frame).x + 
                      e.yyx*map(pos + e.yyx, frame).x + 
                      e.yxy*map(pos + e.yxy, frame).x + 
                      e.xxx*map(pos + e.xxx, frame).x );
}


float calcAO(in vec3 pos, in vec3 nor, in float frame) {
    float ao = 0.0;
    for(int i=0; i < 32; i++) {
        vec3 ap = forwardSF(float(i), 32.);
        float h = hash1(float(i));
        ap *= sign(dot(ap,nor)) * h * .1;
        ao += clamp(map(pos + nor * 0.01 + ap, frame).x * 3., 0., 1.);
    }
    ao /= 32.;
    
    return clamp(ao * 6., 0., 1.);
}

float calcSSS(in vec3 pos, in vec3 nor, in float frame) {
    float occ = 0.;
    for(int i = 0; i < 8; i++) {
        float h = 0.002 + 0.11 * float(i) / 7.;
        vec3 dir = normalize(sin(float(i) * 13.0 + vec3(0., 2.1, 4.2)));
        dir *= sign(dot(dir, nor));
        occ += (h - map(pos - h * dir, frame).x);
    }
    occ = clamp(1. - 11. * occ / 8., 0., 1.);    
    return occ * occ;
}

float calcSoftShadow(in vec3 ro, in vec3 rd, float k, float frame) { 
    float res = 1.0;
    float t = 0.01;
    for(int i = 0; i < 32; i++) {
        float h = map(ro + rd * t, frame).x;
        res = min(res, smoothstep(0., 1.,k * h / t));
        t += clamp(h, .04, .1);
        if(res < .01) {
            break;
        }
    }
    return clamp(res, 0., 1.);
}

vec3 sunDir = normalize(vec3(.2, .1, .02));

vec3 shade(in vec3 ro, in vec3 rd, in float t, in float m, float frame) {
    float eps = .002;
    
    vec3 pos = ro + t * rd;
    vec3 nor = calcNormal(pos, eps, frame);

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

    vec3 green = vec3(0., 255., 198.) / 255.;
    vec3 blue = vec3(117., 210., 217.) / 255.;

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
    float occ = calcAO(pos, nor, frame)*focc;
    float sss = calcSSS(pos, nor, frame);
    sss = sss*occ + fre*occ + (0.5+0.5*fre)*pow(abs(-0.2),1.0)*occ;
    
    float dif1 = clamp( dot(nor,sunDir), 0.0, 1.0 );
    float sha = calcSoftShadow(pos, sunDir, 20.0, frame); 
    dif1 *= sha*fsha;
    float spe1 = clamp( dot(nor,hal), 0.0, 1.0 );

    float bou = clamp( 0.3-0.7*nor.y, 0.0, 1.0 );


    // illumination
    
    vec3 col = vec3(0.0);
    /*
    col += 7.0*vec3(1.7,1.2,0.6)*dif1*2.0;           // sun
    col += 4.0*vec3(0.2,1.2,1.6)*occ*(0.5+0.5*nor.y);    // sky
    */
    col += 1.8*vec3(0.1,2.0,0.1)*bou*occ;                // bounce

    col *= mateD;


    if(m > 1.5) {
        col = dif1 * green;
        col = vec3(0.);
    } else if(m > 0.5) {
        col = dif1 * green;
    }

    col = 0.5 * green;
    mateE = 0.25 * green;


    col += .4*sss*(vec3(0.15,0.1,0.05)+vec3(0.85,0.9,0.95)*dif1)*(0.05+0.95*occ)*mateS; // sss
    col = pow(col,vec3(0.6,0.8,1.0));
    
    col += vec3(1.0,1.0,1.0)*0.2*pow( spe1, 1.0+mateK.x )*dif1*(0.04+0.96*pow(fre,4.0))*mateK.x*mateK.y;   // sun lobe1
    col += vec3(1.0,1.0,1.0)*0.1*pow( spe1, 1.0+mateK.x/3.0 )*dif1*(0.1+0.9*pow(fre,4.0))*mateK.x*mateK.y; // sun lobe2
    col += 0.1*vec3(1.0,max(1.5-0.7*col.y,0.0),2.0)*occ*occ*smoothstep( 0.0, 0.3, reflect( rd, nor ).y )*mateK.x*mateK.y*(0.04+0.96*pow(fre,5.0)); // sky

    col += mateE;

    col += exitAmount;

    return col;        
}


vec2 intersect(in vec3 ro, in vec3 rd, const float mindist, const float maxdist, float frame) {
    vec2 res = vec2(-1.0);
    
    float t = mindist;
    for(int i = 0; i < 256; i++) {
        vec3 p = ro + t*rd;
        vec2 h = map(p, frame);
        res = vec2(t,h.y);

        if( h.x<(0.001*t) ||  t>maxdist ) break;
        
        t += h.x*0.9;
    }
    return res;
}


vec3 render(in vec3 ro, in vec3 rd, in vec2 q, in float frame) {
    vec3 blue = vec3(117., 210., 217.) / 255.;
    vec3 yellow = vec3(255., 252., 0.) / 255.;
    vec3 col = mix(blue, yellow, exitAmount);
    float mindist = 0.01;
    float maxdist = 40.0;

    vec2 tm = intersect(ro, rd, mindist, maxdist, frame);
    if( tm.y>-0.5 && tm.x < maxdist ) {
        col = shade(ro, rd, tm.x, tm.y, frame);
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

    float angle = 0.;
    float radius = 10.8;
    float height = .25;
    float targetHeight = 0.;

    float letterbox = 0.119 * (1. - exitAmount2);

    float xRepeat = 1.;

    if(vUv.y < letterbox || vUv.y > 1. - letterbox) {
        gl_FragColor = vec4(vec3(15., 78., 85.) / 255., 1.);
        return;
    }

    float f1 = frame;
    float f2 = frame;
    float f3 = frame;
    float f4 = frame;
    float angle1 = 15.3;
    float radius1 = 15.;
    float height1 = -5.;
    float angle2 = -15.3;
    float radius2 = 15.;
    float height2 = 5.;
    float angle3 = -15.3;
    float radius3 = 15.;
    float height3 = 5.;
    float angle4 = -0.5;
    float radius4 = 20.;
    float height4 = .0;


    if(frame > 4318.5) {
        angle = 0.;
        radius = mix(20., 10.8, smoothstep(0., 1., (frame - 4318.5) / 150.));
        height = mix(10., .25, smoothstep(0., 1., (frame - 4318.5) / 150.));
    } else if(frame > 4141.5) {
        xRepeat = 4.;
        f4 = 4142.;
        f3 = 4123.;
        f2 = 4111.;
        f1 = 4092.;
    } else if(frame > 4122.5) {
        xRepeat = 4.;
        f4 = 0.;
        f3 = 4123.;
        f2 = 4111.;
        f1 = 4092.;
    } else if(frame > 4110.5) {
        xRepeat = 4.;
        f4 = 0.;
        f3 = 0.;
        f2 = 4111.;
        f1 = 4092.;
    } else if(frame > 4091.5) {
        xRepeat = 4.;
        f4 = 0.;
        f3 = 0.;
        f2 = 0.;
        f1 = 4092.;
    } else if(frame > 3990.5) {
        angle = -.7;
        radius = 5.8;
        height = -2.25;
    } else if(frame > 9999.5) {
        radius = 20.;
        angle = -19.3 - frame / 10.;
        height = 1.5;
        targetHeight = 0.;
    }

    xRepeat /= 2.;

    for(int m = 0; m < 2; m++) {
        for( int n = 0; n < 2; n++) {
            vec2 rr = vec2(float(m), float(n)) / float(AA);

            vec2 p = (-iResolution.xy + 2.0 * (fragCoord.xy + rr)) / iResolution.x;

            p *= xRepeat;
            p.x = mod(p.x -mod(xRepeat, 2.) * 1., 1.) - 0.5;
            p /= xRepeat;
            p *= 16. / 9.;

            vec2 q = (fragCoord.xy+rr) / iResolution.xy;

            float targetFrame = frame;

            float x = vUv.x / xRepeat * 2.;
            float padding = 0.005;
            if(xRepeat > 1.5) {
                if(x < 0.25 - padding) {
                    targetFrame = f1;
                    angle = angle1;
                    radius = radius1;
                    height = height1;
                } else if(x > 0.25 + padding && x < 0.5 - padding) {
                    targetFrame = f2;
                    angle = angle2;
                    radius = radius2;
                    height = height2;
                } else if(x > 0.5 + padding && x < 0.75 - padding) {
                    targetFrame = f3;
                    angle = angle3;
                    radius = radius3;
                    height = height3;
                } else if(x > 0.75 + padding) {
                    targetFrame = f4;
                    angle = angle4;
                    radius = radius4;
                    height = height4;
                } else {
                    gl_FragColor = vec4(1.);
                    return;
                }
            }

            if(targetFrame < 10.) {
                gl_FragColor = vec4(1.);
                return;
            }

            vec3 ro = vec3(radius * sin(angle), height, radius * cos(angle));
            vec3 ta = vec3(.0, targetHeight, 0.);
            mat3 ca = setCamera(ro, ta, 0.);
            vec3 rd = normalize(ca * vec3(p, -2.8));

            col += render(ro, rd, q, targetFrame);
        }
    }
    col /= 5.;
    gl_FragColor = vec4(col, 1.0);
}
