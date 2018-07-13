(function(global) {
  class sheipzideeNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);

      this.texture = Loader.loadTexture('res/zentangles/paper.jpg');
    }

    update(frame) {
      this.uniforms.frame.value = frame - 76.;
    }
  }

  global.sheipzideeNode = sheipzideeNode;
})(this);
