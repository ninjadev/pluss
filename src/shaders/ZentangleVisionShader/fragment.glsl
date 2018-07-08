uniform float frame;
uniform sampler2D tDiffuse;
uniform sampler2D z1;
uniform sampler2D z2;
uniform sampler2D z3;
uniform sampler2D z4;
uniform sampler2D z5;
uniform sampler2D z6;

#define number_of_zs 6
#define EDGE_WIDTH 0.003

varying vec2 vUv;

void main() {
    //gl_FragColor = vec4(vUv, 0.5 + 0.5 * sin(frame / 60.0), 1.0);
    vec4 color = texture2D(tDiffuse, vUv);
    
    // Doing edge detection, simple sobel thingy
    vec4 up = texture2D(tDiffuse, vec2(vUv.x, vUv.y + EDGE_WIDTH));
    vec4 right = texture2D(tDiffuse, vec2(vUv.x + EDGE_WIDTH, vUv.y));
    float red = abs(color.r-right.r)+abs(color.r-up.r);
    float green = abs(color.g-right.g)+abs(color.g-up.g);
    float blue = abs(color.b-right.b)+abs(color.b-up.b);






    float intensity = color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;
    vec4 zentangled_color;
    if (intensity < 1./6.)
    {
      zentangled_color = texture2D(z1, vUv);
    }
    else if (intensity < 2./6.)
    {
      zentangled_color = texture2D(z2, vUv);
    }
    else if (intensity < 3./6.)
    {
      zentangled_color = texture2D(z3, vUv);
    }
    else if (intensity < 4./6.)
    {
      zentangled_color = texture2D(z4, vUv);
    }
    else if (intensity < 5./6.)
    {
      zentangled_color = texture2D(z5, vUv);
    }
    else
    {
      zentangled_color = texture2D(z6, vUv);
    }
    zentangled_color = vec4(zentangled_color.r - red * 1000.,
                            zentangled_color.g - green * 1000., 
                            zentangled_color.b - blue * 1000., 
                            1.0);
    gl_FragColor = zentangled_color;
}
