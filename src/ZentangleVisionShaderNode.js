(function(global) {
  class ZentangleVisionShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
         texture: new NIN.TextureInput(),
      }
      super(id, options);

      this.test = Loader.loadTexture('res/test_train.jpg');

      this.z1 = Loader.loadTexture('res/zentangles/z1.jpg');
      this.z2 = Loader.loadTexture('res/zentangles/z2.png');
      this.z3 = Loader.loadTexture('res/zentangles/z8.png');
      this.z4 = Loader.loadTexture('res/zentangles/z10.jpg');
      this.z5 = Loader.loadTexture('res/zentangles/z11.jpg');
      this.z6 = Loader.loadTexture('res/zentangles/z12.jpg');
    }

    update(frame) {
      if (frame % 200 < 100)
      {
        this.uniforms.tDiffuse.value = this.inputs.texture.getValue();
        this.uniforms.z1.value = this.z1;
        this.uniforms.z2.value = this.z2;
        this.uniforms.z3.value = this.z3;
        this.uniforms.z4.value = this.z4;
        this.uniforms.z5.value = this.z5;
        this.uniforms.z6.value = this.z6;
        this.uniforms.frame.value = frame;
      }
      else
      {
        this.uniforms.tDiffuse.value = this.inputs.texture.getValue();
        this.uniforms.z1.value = this.inputs.texture.getValue();
        this.uniforms.z2.value = this.inputs.texture.getValue();
        this.uniforms.z3.value = this.inputs.texture.getValue();
        this.uniforms.z4.value = this.inputs.texture.getValue();
        this.uniforms.z5.value = this.inputs.texture.getValue();
        this.uniforms.z6.value = this.inputs.texture.getValue();
        this.uniforms.frame.value = frame;        
      }
    }
  }

  global.ZentangleVisionShaderNode = ZentangleVisionShaderNode;
})(this);
