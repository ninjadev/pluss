(function(global) {
  class yoyoCombinerNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput()
      };
      super(id, options);
    }

    beforeUpdate(frame) {
      this.inputs.A.enabled = BEAN >= 1680;
      this.inputs.B.enabled = true;
    }

    warmup(renderer) {
      this.update(2735);
      this.render(renderer);
    }

    update(frame) {
      this.uniforms.t.value = frame;
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
    }
  }

  global.yoyoCombinerNode = yoyoCombinerNode;
})(this);
