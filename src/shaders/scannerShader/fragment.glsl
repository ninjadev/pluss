varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;
uniform float blastDistance;

#define camera_x 0.
#define camera_y 0.
#define camera_z -100.
#define origin_x 0.
#define origin_y 0.
#define origin_z -15.
#define blastWidth 10.
// This is the base used to calculate the cameras edges. 
// A camera with a far plane at 1 with an aspect ratio of
// 16/9 will have the vertical edge at (1,1.4733).
#define angle_unit_x 1.4733 
#define aspect_ratio (16.0 / 9.0)


/*float horizBars(float y)
{
  return 0.5 + sin(y * 10) / 2.0;
} */

void main() {
  vec3 diffuse = texture2D(tDiffuse, vUv).rgb;
  float depth = texture2D(tDepth, vUv).x;

  float linear_depth = depth * ((cameraFar - cameraNear) + cameraNear) / cameraFar; // For now near is so close to the camera that this will do. Should be calculated more exact.

  // Vector from camera to pixel
  vec3 wsDir = vec3(   (vUv.x - 0.5) * 2.0 * angle_unit_x * cameraFar,
                        (vUv.y - 0.5) * 2.0 * angle_unit_x / aspect_ratio * cameraFar,
                        cameraFar
                    );

  vec3 camera_pos = vec3(camera_x, camera_y, camera_z);
  
  vec3 wsPos = camera_pos + wsDir * linear_depth;

  // Origin of blast
  vec3 origin = vec3(origin_x, origin_y, origin_z);

  float distance_from_origin = distance(wsPos, origin);

  if (distance_from_origin < blastDistance && distance_from_origin > blastDistance - blastWidth) {
    float scanner_color = (1.0 + floor((0.5 + sin(vUv.y * 400.0) / 2.0) * 2.0)) / 2.0;
    float scanner_intensity = (distance_from_origin - (blastDistance - blastWidth)) / blastWidth;
    gl_FragColor.rgb = vec3(scanner_color * scanner_intensity + (1.0 - scanner_intensity) * diffuse.x,
                            scanner_color * scanner_intensity + (1.0 - scanner_intensity) * diffuse.y,
                            scanner_color * scanner_intensity + (1.0 - scanner_intensity) * diffuse.z
                            ); 
  }
  else
  {
    gl_FragColor.rgb = diffuse;
  }
  gl_FragColor.a = 1.0;
}