(function(global) {
  class dimentionMultiplexerShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
         textureBG: new NIN.TextureInput(),
         depthBG: new NIN.TextureInput(),
         texture1: new NIN.TextureInput(),
         depth1: new NIN.TextureInput(),
         texture2: new NIN.TextureInput(),
         depth2: new NIN.TextureInput(),
      }
      super(id, options);
    }

    update(frame) {
      this.uniforms.tDiffuseBG.value = this.inputs.textureBG.getValue();
      this.uniforms.tDepthBG.value = this.inputs.depthBG.getValue();
      this.uniforms.tDiffuse1.value = this.inputs.texture1.getValue();
      this.uniforms.tDepth1.value = this.inputs.depth1.getValue();
      this.uniforms.tDiffuse2.value = this.inputs.texture2.getValue();
      this.uniforms.tDepth2.value = this.inputs.depth2.getValue();
      this.uniforms.cameraNear.value = 50;
      this.uniforms.cameraFar.value = 150;
      this.uniforms.blastDistance.value = 40;
//      this.uniforms.blastDistance.value = frame % 350;
      this.uniforms.origin_x.value = 80 * Math.sin(frame / 30);
      this.uniforms.origin_y.value = 0;//10 * Math.sin(frame / 100);
      this.uniforms.origin_z.value = -15;
      this.uniforms.frame.value = frame;
    }
  }

  global.dimentionMultiplexerShaderNode = dimentionMultiplexerShaderNode;
})(this);
