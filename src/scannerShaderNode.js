(function(global) {
  class scannerShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
         texture: new NIN.TextureInput(),
         depth: new NIN.TextureInput(),
      }
      super(id, options);
    }

    update(frame) {
      this.uniforms.tDiffuse.value = this.inputs.texture.getValue();
      this.uniforms.tDepth.value = this.inputs.depth.getValue();
      this.uniforms.cameraNear.value = 50;
      this.uniforms.cameraFar.value = 150;
      this.uniforms.blastDistance.value = frame % 350;
      this.uniforms.frame.value = frame;
    }
  }

  global.scannerShaderNode = scannerShaderNode;
})(this);
