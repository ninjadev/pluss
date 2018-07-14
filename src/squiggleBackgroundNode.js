(function(global) {
  class squiggleBackgroundNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.squiggleBackgroundNode = squiggleBackgroundNode;
})(this);
