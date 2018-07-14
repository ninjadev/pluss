(function(global) {
  class starshaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        overlay: new NIN.TextureInput(),
        underlay: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.overlay.value = this.inputs.overlay.getValue();
      this.uniforms.underlay.value = this.inputs.underlay.getValue();
    }

    warmup(renderer) {
      this.update(6772);
      this.render(renderer);
    }
  }

  global.starshaderNode = starshaderNode;
})(this);
