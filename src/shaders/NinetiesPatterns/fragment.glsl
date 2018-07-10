uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

float rmin(float a, float b, float r) {
    vec2 u = max(vec2(r - a,r - b), vec2(0));
    return max(r, min (a, b)) - length(u);
}

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
    float size = 0.15;

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

    vec3 currentPattern = bananaPattern(p);

    gl_FragColor = vec4(currentPattern, 0.);
}
