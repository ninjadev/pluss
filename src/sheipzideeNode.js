(function(global) {
  class sheipzideeNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame - 76.;
    }
  }

  global.sheipzideeNode = sheipzideeNode;
})(this);
