(function(global) {
  class TestShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {sprinkles: new NIN.TextureInput()};
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
      this.uniforms.sprinkles.value = this.inputs.sprinkles.getValue();
    }

    warmup(renderer) {
      this.update(6006);
      this.render(renderer);
    }
  }

  global.TestShaderNode = TestShaderNode;
})(this);
