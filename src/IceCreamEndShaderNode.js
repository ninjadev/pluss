(function(global) {
  class IceCreamEndShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
         tree: new NIN.TextureInput(),
         icecream: new NIN.TextureInput(),
      }
      super(id, options);
    }

    update(frame) {
      if (frame > 6125)
      {
        this.uniforms.tree.value = this.inputs.tree.getValue();
      }
      else
      {
        this.uniforms.tree.value = this.inputs.icecream.getValue();
      } 
      this.uniforms.icecream.value = this.inputs.icecream.getValue();
      this.uniforms.frame.value = frame;
    }

    warmup(renderer) {
      this.update(5998);
      this.render(renderer);
    }
  }

  global.IceCreamEndShaderNode = IceCreamEndShaderNode;
})(this);
