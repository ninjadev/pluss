uniform float frame;
uniform sampler2D tree;
uniform sampler2D icecream;
varying vec2 vUv;

void main() {
    vec4 tree_color = texture2D(tree, vUv);
    vec4 icecream_color = texture2D(icecream, vUv);

    if (tree_color.r + tree_color.g + tree_color.b > 0.1)
    {
        gl_FragColor = tree_color;
    }
    else
    {
        gl_FragColor = icecream_color;
    }
    
}
