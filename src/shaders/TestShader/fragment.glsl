uniform float frame;
uniform sampler2D tDiffuse;
varying vec2 vUv;

float dist_from_center(vec2 vUv){
    // 0-> 0.25 ---- 0->1.0
    return (1.0 -  sqrt( pow((0.5-vUv.x)*2.0,2.0) + pow((0.5-vUv.y)*2.0,2.0)));
}

// 0.5, 0.5 i midten 
void main() {
    gl_FragColor = vec4(vUv,0.5 + sin(frame / 60.0), pow(max(0.0, dist_from_center(vUv)), 0.5));
}
