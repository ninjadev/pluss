(function(global) {
  class IceShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {iceSprinkles: new NIN.TextureInput()};
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
      this.uniforms.iceSprinkles.value = this.inputs.iceSprinkles.getValue();
    }
  }

  global.IceShaderNode = IceShaderNode;
})(this);
