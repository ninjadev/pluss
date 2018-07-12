uniform float frame;
uniform sampler2D tDiffuse;
uniform sampler2D overlay;

varying vec2 vUv;

void main() {
    vec3 original = texture2D(tDiffuse, vUv).xyz;
    vec4 overlay = texture2D(overlay, vUv);
    vec3 shadow = texture2D(tDiffuse, vUv + vec2(-0.03, 0.03) * 9. / 16. * 0.5).xyz;
 
    float shadowMultiplier = max(0., sign(original.x - shadow.x));

    vec3 pink = vec3(228., 95., 162.) / 255.;
    vec3 purple = vec3(132., 5., 197.) / 255.;
    vec3 shadowColor = vec3(102., 31., 132.) / 255.;

    vec3 color = 1. - (1. - pink ) * (1. - original);

    if(color.x > 0.9 && color.y > 0.9 && color.z > 0.9) {
        color = purple;
    }

    color = mix(color, shadowColor, shadowMultiplier);

    color = mix(color, overlay.xyz, overlay.a);

    gl_FragColor = vec4(color, 1.);
}
