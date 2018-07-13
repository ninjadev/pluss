(function(global) {
  class shadowizerNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
        overlay: new NIN.TextureInput(),
        osd: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.overlay.value = this.inputs.overlay.getValue();
      this.uniforms.osd.value = this.inputs.osd.getValue();
    }
  }

  global.shadowizerNode = shadowizerNode;
})(this);
