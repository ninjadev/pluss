uniform float t;
uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

void main()
{
    vec4 colorA = texture2D(A, vUv);  // background
    vec4 colorB = texture2D(B, vUv);  // foreground

    gl_FragColor = mix(colorA, colorB, colorB.a);
}
