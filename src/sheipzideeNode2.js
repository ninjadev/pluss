(function(global) {
  class sheipzideeNode2 extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.sheipzideeNode2 = sheipzideeNode2;
})(this);
