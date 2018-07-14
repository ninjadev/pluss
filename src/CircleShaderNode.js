(function(global) {
  class CircleShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {circleOlav: new NIN.TextureInput()};
      super(id, options);
      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      });
      this.resize();
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.circleOlav.value = this.inputs.circleOlav.getValue();
    }
  }

  global.CircleShaderNode = CircleShaderNode;
})(this);
