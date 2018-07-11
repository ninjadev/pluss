(function(global) {
  class TestShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {sprinkles: new NIN.TextureInput()};
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.sprinkles.value = this.inputs.sprinkles.getValue();
    }
  }

  global.TestShaderNode = TestShaderNode;
})(this);
