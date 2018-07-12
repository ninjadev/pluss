uniform float frame;
uniform sampler2D tDiffuse;
varying vec2 vUv;
uniform sampler2D sprinkles;

float dist_from_center(vec2 vUv){
    // 0-> 0.25 ---- 0->1.0
    return (1.0 -  sqrt( pow((0.5-vUv.x)*2.0,2.0) + pow((0.5-vUv.y)*2.0,2.0)));
}

// 0.5, 0.5 i midten 
void main() {
    vec4 sprinkle_texture = texture2D(sprinkles, vUv);
    gl_FragColor = vec4(sprinkle_texture.r, sprinkle_texture.g, sprinkle_texture.b, pow(max(0.0, dist_from_center(vUv)), 0.5));
    
}
