uniform float frame;
uniform sampler2D tDiffuse;
uniform sampler2D paperTexture;

varying vec2 vUv;

void main() {
    vec4 screen = texture2D(tDiffuse, vUv);

    gl_FragColor = (mix(
        screen,
        screen * texture2D(paperTexture, vUv * 1.25),
        0.115) * 1.05
    );
}
