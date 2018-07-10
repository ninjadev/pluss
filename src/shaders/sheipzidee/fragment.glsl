uniform float frame;
uniform float blast;
#define PI 3.141592653589793
#define EPSILON 0.0001

varying vec2 vUv;

const int MAX_MARCHING_STEPS = 255;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const vec2 RESOLUTION = vec2(1920., 1080.);

mat3 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(1, 0, 0),
        vec3(0, c, -s),
        vec3(0, s, c)
    );
}

mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c)
    );
}

mat3 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, -s, 0),
        vec3(s, c, 0),
        vec3(0, 0, 1)
    );
}

vec2 intersectSDF(vec2 distA, vec2 distB) {
    if(distA.x > distB.x) {
        return distA;
    }
    return distB;
}

vec2 unionSDF(vec2 distA, vec2 distB) {
    if(distA.x < distB.x) {
        return distA;
    }
    return distB;
}

vec2 differenceSDF(vec2 distA, vec2 distB) {
    return vec2(max(distA.x, -distB.x), distA.y);
}

float boxSDF(vec3 p, vec3 size) {
    vec3 d = abs(p) - (size / 2.0);
    float insideDistance = min(max(d.x, max(d.y, d.z)), 0.0);
    float outsideDistance = length(max(d, 0.0));
    return insideDistance + outsideDistance;
}

float sphereSDF(vec3 p, float r) {
    return length(p) - r;
}

float cylinderSDF(vec3 p, float h, float r) {
    float inOutRadius = length(p.xy) - r;
    float inOutHeight = abs(p.z) - h/2.0;
    float insideDistance = min(max(inOutRadius, inOutHeight), 0.0);
    float outsideDistance = length(max(vec2(inOutRadius, inOutHeight), 0.0));
    return insideDistance + outsideDistance;
}


vec3 n1 = vec3(1.000,0.000,0.000);
vec3 n2 = vec3(0.000,1.000,0.000);
vec3 n3 = vec3(0.000,0.000,1.000);
vec3 n4 = vec3(0.577,0.577,0.577);
vec3 n5 = vec3(-0.577,0.577,0.577);
vec3 n6 = vec3(0.577,-0.577,0.577);
vec3 n7 = vec3(0.577,0.577,-0.577);
vec3 n8 = vec3(0.000,0.357,0.934);
vec3 n9 = vec3(0.000,-0.357,0.934);
vec3 n10 = vec3(0.934,0.000,0.357);
vec3 n11 = vec3(-0.934,0.000,0.357);
vec3 n12 = vec3(0.357,0.934,0.000);
vec3 n13 = vec3(-0.357,0.934,0.000);
vec3 n14 = vec3(0.000,0.851,0.526);
vec3 n15 = vec3(0.000,-0.851,0.526);
vec3 n16 = vec3(0.526,0.000,0.851);
vec3 n17 = vec3(-0.526,0.000,0.851);
vec3 n18 = vec3(0.851,0.526,0.000);
vec3 n19 = vec3(-0.851,0.526,0.000);

float octahedral(vec3 p, float e, float r) {
    float s = pow(abs(dot(p,n4)),e);
    s += pow(abs(dot(p,n5)),e);
    s += pow(abs(dot(p,n6)),e);
    s += pow(abs(dot(p,n7)),e);
    s = pow(s, 1./e);
    return s-r;
}

float pModInterval1(inout float p, float size, float start, float stop) {
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p+halfsize, size) - halfsize;
	if (c > stop) {
		p += size*(c - stop);
		c = stop;
	}
	if (c <start) {
		p += size*(c - start);
		c = start;
	}
	return c;
}

vec2 sceneSDF(vec3 samplePoint) {    
    if(frame > 2095.75) {
        samplePoint = rotateY(7. + frame / 60.) * samplePoint;
    } else {
        samplePoint = rotateY(1. -frame / 12.) * samplePoint;
    }


    float wobble =  0.01 * sin(samplePoint.x * 11. + frame / 10.) + 0.01 * sin(samplePoint.z * 8. + frame / 20.);

    vec2 ground = vec2(boxSDF(samplePoint + vec3(0., 5., 0.), vec3(100., 1., 100)), 2.);

    vec3 boxPoint = rotateZ(-PI / 4.) * (samplePoint - vec3(4., 0., 0.));
    vec2 box = vec2(boxSDF(boxPoint, vec3(3., 1., 1.)), 1.);

    vec2 sphere = vec2(sphereSDF(samplePoint, sqrt(2.)), .5);

    vec2 pyramid = vec2(octahedral(samplePoint + vec3(4., 0., 0.), 64., 1.), 1.);

    vec2 shapes = unionSDF(unionSDF(box, sphere), pyramid);

    vec2 result = unionSDF(shapes, ground);

    return result;
}

vec2 shortestDistanceToSurface(vec3 eye, vec3 marchingDirection, float start, float end) {
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        vec2 dist = sceneSDF(eye + depth * marchingDirection);
        if (dist.x < EPSILON) {
            return vec2(depth, dist.y);
        }
        depth += dist.x;
        if (depth >= end) {
            return vec2(end, dist.y);
        }
    }
    return vec2(end, 0.);
}

float softshadow(out vec3 p, vec3 eye, vec3 marchingDirection, float start, float end, float k) {
    float res = 1.;
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        p = eye + marchingDirection * depth;
        float h = sceneSDF(p).x;
        if(h < EPSILON) {
            return 0.;
        }
        depth += h;
        res = min(res, k * h / depth);
    }
    return res;
}

float translucency(vec3 eye, vec3 marchingDirection, float stepSize, float start) {
    float depth = start;
    const int steps = 64;
    for (int i = 0; i < steps; i++) {
        vec2 s = sceneSDF(eye + marchingDirection * depth);
        float h = s.x;
        if(h > EPSILON) {
            float amount = 0.;
            if(s.y > 3.5) {
                amount = 0.;
            } else if(s.y > 2.5) {
                amount = 0.;
            } else if(s.y > 1.5) {
                amount = 0.;
            } else if(s.y > 0.5) {
                amount = 1.;
            }
            return pow(amount * (1. - float(i) / float(steps)), 4.);
        }
        depth += stepSize;
    }
    return 0.;
}

float ambientOcclusion(vec3 eye, vec3 marchingDirection, float start) {
    float depth = start;
    for (int i = 0; i < 64; i++) {
        float h = sceneSDF(eye + marchingDirection * depth).x * 0.5;
        if(depth > 1.) {
            return 1. - float(i) / 64.;
        }
        depth += h;
    }
    return 0.;
}
            

vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
    vec2 xy = fragCoord - size / 2.0;
    float z = size.y / tan(radians(fieldOfView) / 2.0);
    return normalize(vec3(xy, -z));
}

vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        sceneSDF(vec3(p.x + EPSILON, p.y, p.z)).x - sceneSDF(vec3(p.x - EPSILON, p.y, p.z)).x,
        sceneSDF(vec3(p.x, p.y + EPSILON, p.z)).x - sceneSDF(vec3(p.x, p.y - EPSILON, p.z)).x,
        sceneSDF(vec3(p.x, p.y, p.z  + EPSILON)).x - sceneSDF(vec3(p.x, p.y, p.z - EPSILON)).x
    ));
}

vec3 phongContribForLight(vec3 N, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye,
                          vec3 lightPos, vec3 lightIntensity) {
    vec3 L = normalize(lightPos - p);
    vec3 V = normalize(eye - p);
    vec3 R = normalize(reflect(-L, N));
    
    float dotLN = dot(L, N);
    float dotRV = dot(R, V);
    
    if (dotLN < 0.0) {
        return vec3(0.0, 0.0, 0.0);
    } 
    
    if (dotRV < 0.0) {
        return lightIntensity * (k_d * dotLN);
    }
    return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
}

mat3 _viewMatrix(vec3 eye, vec3 center, vec3 up) {
    vec3 f = normalize(center - eye);
    vec3 s = normalize(cross(f, up));
    vec3 u = cross(s, f);
    return mat3(s, u, -f);
}

void main() {
    vec3 viewDir = rayDirection(45.0, RESOLUTION, vUv * RESOLUTION);
    vec3 eye = vec3(0., 10.0, 20.);
    
    mat3 viewToWorld = _viewMatrix(eye, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    
    vec3 worldDir = viewToWorld * viewDir;
    
    vec2 dist = shortestDistanceToSurface(eye, worldDir, MIN_DIST, MAX_DIST);
    
    vec3 gray = vec3(254., 231., 73.) / 255.;
    if (dist.x > MAX_DIST - EPSILON) {
        gl_FragColor = vec4(255., 166., 189., 255.) / 255.;
        return;
    }

    vec3 p = eye + dist.x * worldDir;
    vec3 black = vec3(0.);
    vec3 pink = vec3(255., 166., 189.) / 255.;
    vec3 yellow = vec3(255., 252., 0.) / 255.;
    vec3 green = vec3(28., 153., 157.) / 255.;
    float shininess = 1.;
    float ambient = 0.;
    float emissive = 0.;

    vec3 diffuse = black;
    if(dist.y >= 3.5) {
        diffuse = vec3(0.);
        shininess = 100.;
        ambient = 1.;
        emissive = blast;
    } else if(dist.y >= 2.5) {

        diffuse = green;
        shininess = 100.;
        ambient = 1.;
        emissive = blast;
    } else if(dist.y >= 1.5) {
        diffuse = .9 * pink;
        shininess = 2.;
        ambient = .2;
        emissive = 0.;
    } else if(dist.y > 0.5) {
        diffuse = yellow;
        shininess = 100.;
        ambient = 1.;
        emissive = blast;
    }
    
    vec3 ambientLight = ambient * vec3(1.0, 1.0, 1.0);
    
    vec3 light1Pos = normalize(vec3(-1., 5., 2.));
    vec3 light1Intensity = vec3(0.4, 0.4, 0.4);

    vec3 N = estimateNormal(p);
    
    vec3 shadowCaster;
    float shadow = softshadow(shadowCaster, p, light1Pos, 0.05, MAX_DIST, 128.);
    float shadowCasterMaterial = sceneSDF(shadowCaster).y;
    vec3 shadowCasterDiffuse = vec3(0.);
    if(shadowCasterMaterial < 1.5) {
        shadowCasterDiffuse = yellow;
    }
    float shadowTranslucency = translucency(shadowCaster, light1Pos, 0.01, 0.);
    float materialTranslucency = translucency(p, worldDir, 0.01, 0.);

    vec3 shadowWithTranslucency = vec3(1. - (1. - shadow) * (1. - shadowCasterDiffuse * shadowTranslucency));

    vec3 _;
    vec3 color = vec3(0.);
    color += clamp(phongContribForLight(N, diffuse, diffuse, shininess, p, eye, light1Pos, light1Intensity), 0., 1.)
        * shadowWithTranslucency
        ;

    color *= ambientOcclusion(p, N, 0.01) * (1. - materialTranslucency);

    color = pow(color, vec3(2.2));

    if(color.x > 1. || color.y > 1. || color.z > 1.) {
        color = vec3(1., 0., 0.);
    }


    color += (1. + blast) * yellow * (1. - ambientOcclusion(p, N, 0.001));

    color += 0.5 * emissive;

    color += ambientLight * diffuse;

    gl_FragColor = vec4(color, 1.0);
}
