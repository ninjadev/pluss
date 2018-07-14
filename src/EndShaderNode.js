(function (global) {
  class EndShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        overlay: new NIN.TextureInput(),
        background: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.overlay.value = this.inputs.overlay.getValue();
      this.uniforms.background.value = this.inputs.background.getValue();
    }

    warmup(renderer) {
      this.update(8212);
      this.render(renderer);
    }
  }

  global.EndShaderNode = EndShaderNode;
})(this);
