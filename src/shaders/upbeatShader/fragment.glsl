uniform float frame;
uniform float time;
uniform float scene;
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

void main() {
    vec2 p = vUv;
    p -= 0.5;
    p.x *= 16. / 9.;

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
        col = (
            vec3(1., 1., 0.)
        );
    }

    gl_FragColor = vec4(col, 0.);
}
