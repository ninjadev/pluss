(function(global) {
  class sheipzideeNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.sheipzideeNode = sheipzideeNode;
})(this);
