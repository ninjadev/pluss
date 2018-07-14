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
      this.uniforms.cameraNear.value = 1;
      this.uniforms.cameraFar.value = 150;
      this.uniforms.blastDistance.value = 0; //(frame * 9) % 350;
      this.uniforms.frame.value = frame;

      if (frame > 5082 && frame < 5150)
      {
        this.uniforms.blastDistance.value = (frame - 5082) * 4;
      }
      else if (frame > 5150 && frame < 5280)
      {
        this.uniforms.blastDistance.value = (frame - 5150) * 4;
      }
    }
  }

  global.scannerShaderNode = scannerShaderNode;
})(this);
