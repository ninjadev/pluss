(function(global) {
  class sheipzideeNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    warmup(renderer) {
      this.update(3731);
      this.render(renderer);
    }

    update(frame) {
      this.uniforms.frame.value = frame - 76.;
    }
  }

  global.sheipzideeNode = sheipzideeNode;
})(this);
