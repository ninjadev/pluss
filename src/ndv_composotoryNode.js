(function(global) {
  class ndv_composotoryNode extends NIN.ShaderNode {
    constructor(id, options) {
    	options.inputs = {
        logo : new NIN.TextureInput(),
    		patterns: new NIN.TextureInput(),
        background: new NIN.TextureInput()
      }
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.logo.value = this.inputs.logo.getValue();
      this.uniforms.patterns.value = this.inputs.patterns.getValue();
      this.uniforms.background.value = this.inputs.background.getValue();
    }
  }

  global.ndv_composotoryNode = ndv_composotoryNode;
})(this);
