(function(global) {
  class ZentangleVisionShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
         three_scene: new NIN.TextureInput(),
         bgzigzag: new NIN.TextureInput(),
         bgrightarrow: new NIN.TextureInput(),
         bgpink: new NIN.TextureInput(),
         bgblue: new NIN.TextureInput(),
         bgpants: new NIN.TextureInput(),
         squiggles: new NIN.TextureInput(),
      }
      super(id, options);
    }

    warmup(renderer) {
      this.update(6949);
      this.render(renderer);
    }

    update(frame) {
      // if (frame % 400 < 300)
      // if (false)
      if(true)
      {
        this.uniforms.tDiffuse.value = this.inputs.three_scene.getValue();
        this.uniforms.z1.value = this.inputs.bgpants.getValue();
        this.uniforms.z2.value = this.inputs.squiggles.getValue();
        this.uniforms.z3.value = this.inputs.bgblue.getValue();
        this.uniforms.z4.value = this.inputs.bgrightarrow.getValue();
        this.uniforms.z5.value = this.inputs.bgzigzag.getValue();
        this.uniforms.z6.value = this.inputs.bgpink.getValue();
        this.uniforms.frame.value = frame;
      }
      else
      {
        this.uniforms.tDiffuse.value = this.inputs.three_scene.getValue();
        this.uniforms.z1.value = this.inputs.three_scene.getValue();
        this.uniforms.z2.value = this.inputs.three_scene.getValue();
        this.uniforms.z3.value = this.inputs.three_scene.getValue();
        this.uniforms.z4.value = this.inputs.three_scene.getValue();
        this.uniforms.z5.value = this.inputs.three_scene.getValue();
        this.uniforms.z6.value = this.inputs.three_scene.getValue();
        this.uniforms.frame.value = frame;
      }
      this.uniforms.z2.value = this.inputs.three_scene.getValue();
      this.uniforms.z3.value = this.inputs.three_scene.getValue();
      this.uniforms.z4.value = this.inputs.three_scene.getValue();
      this.uniforms.z5.value = this.inputs.three_scene.getValue();
      this.uniforms.z6.value = this.inputs.three_scene.getValue();
    }
  }

  global.ZentangleVisionShaderNode = ZentangleVisionShaderNode;
})(this);
