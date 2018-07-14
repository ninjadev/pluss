uniform float frame;
uniform float time;
uniform float invert;
uniform float scene;
uniform float sync;
uniform sampler2D tDiffuse;

varying vec2 vUv;

const float PI = acos(-1.);

float hash(float posh){
    vec2 p = vec2(posh);
    return fract(sin(dot(p,vec2(12.9898,78.233))) * 43758.5453);
}

float easeOutSin(float t) {
    return sin((PI / 2.) * t);
}

mat2 rotate(float a) {
    return mat2(-sin(a), cos(a),
                 cos(a),sin(a));
}

float thingy(vec2 p, vec2 offset, float size, float rotation, float shape) {
    p *= rotate(rotation * PI);


    float square = max(abs(p.x - offset.x)  - size, abs(p.y - offset.y) - size * 0.15);
    float circle = length(p - offset) - size;

    return mix(square, circle, shape);
}

float transPattern(vec2 p) {
    p.x += 0.25;

    vec2 size = vec2(0.005, 0.02);

    vec2 rep = vec2(0.06, 0.2);

    float px = floor(p.x / rep.x);

    p.y += time;
    p.y -= px * 0.5;

    p = mod(p, rep);
    p -= rep * 0.5;


    return max(abs(p.x) - size.x, abs(p.y) - size.y);
}

void main() {
    vec2 p = vUv;
    p -= 0.5;
    p.x *= 16. / 9.;

    if(frame >= 7160.5 && frame < 7425.5) {
         p /= 2.;
    }

    p = mix(p, p + hash(p.x + p.y * (1231321. + 342234.) * invert), invert);

    vec3 col;

    if (scene < 1.) {
        float spiral;
        float particles = 1337.;
        float particle_outline;

        spiral = length(p - cos(atan(p.x, p.y) * 25. + time * 0.5) * 0.4) - 1.;
        spiral = smoothstep(0., 0.1 + tan(time * 15.) * 0.2, spiral);

        for (float i = 0.; i < 2.5; i += 0.025) {
            vec2 offset = 0.5 - vec2(hash(i), hash(i + 0.25));
            offset *= easeOutSin(time) * 6. * (0.75 + 0.25 * hash(i + 2424.));

            particles = min(particles, thingy(p, offset, hash(i + 2424.) * 0.1 - clamp((time - 0.2), 0., 1.) * 0.25, hash(i + 1337.), hash(i + 666.)));
        }

        particle_outline = max(particles, -(particles + 0.00001));
        particle_outline = smoothstep(0., 0.01, particle_outline);
        particles = smoothstep(0., 0.01, particles);

        float bg = particles * spiral;

        col = (
            vec3(1.0, abs(p.y), 0.25) * bg +
            vec3(1., 1. - (1. - length(p)) * 0.15, 0.) * (1. - spiral) * particles * particle_outline +
            vec3(tan(time * 20. + 0.25), tan(time * 100.), tan(time * 5. + 0.35)) * (1. - particles) * particle_outline
        );
    }
    else if (scene < 10.) {
        float edgies = 12421.;
        float size = 0.03;

        p.y -= time * 0.001;

        for (float x = 0.; x < 32.; x++) {
            for (float y = 0.; y < 16.; y++) {
                vec2 offset = 0.5 - vec2(x - 9.25, y) * size * (2. + (time * 0.15));

                float edge = max(abs(p.x - offset.x) - size, abs(p.y - offset.y) - size);

                float rotation = (2. * PI * hash(x * y + sync));
                // More geometric version (aka more boring)
                // float rotation = (2. * PI + PI * (0.25 + sync)) * floor(32. * hash(x * y + sync/*floor(time * 4.)*/));

                edge = max(edge, ((p - offset) * rotate(rotation)).y);

                edgies = min(edgies, edge);
            }
        }

        float transPat = transPattern(p);
        edgies = mix(edgies, transPat, clamp((time - 5.0) * 1., 0., 1.));
        edgies = smoothstep(0., 0.01, edgies);

        col = vec3(.996, .988, 0.);
        if(frame >= 7274.5 && frame < 7425.5) {
            col = vec3(244., 66., 231.) / 255.;
            edgies = 1. - edgies;
            col += edgies;
            col = clamp(col, 0., 1.);
    float letter = clamp(mix(0., 0.14, (frame - 7142.) / (7161. - 7142.)), 0., 0.14);
    if(vUv.y < letter) {
        col = vec3(0.1);
    }
    if(vUv.y > 1. - letter) {
        col = vec3(0.1);
    }
    if(vUv.x < letter) {
        col = vec3(0.1);
    }
    if(vUv.x > 1. - letter) {
        col = vec3(0.1);
    }
        } else {
            col = mix(vec3(157., 67., 22.) / 255. * 0.7, col, edgies);
        }


    }


    col = mix(col, fract(vec3(hash(col.x), hash(col.y), hash(col.z))), invert);


    gl_FragColor = vec4(col, 0.);
}
