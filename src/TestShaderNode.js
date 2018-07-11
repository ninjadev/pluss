(function(global) {
  class TestShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.TestShaderNode = TestShaderNode;
})(this);
