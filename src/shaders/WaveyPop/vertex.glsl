uniform sampler2D tDiffuse;

varying vec2 p;

void main() {
    p = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
