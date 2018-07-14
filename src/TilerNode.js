(function(global) {
  class TilerNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.multiplier.value = 1.0;
      if (BEAN >= 1632 && BEAN < 1644) {
        this.uniforms.multiplier.value = 2.0;
      } else if (BEAN >= 1644 && BEAN < 1652) {
        this.uniforms.multiplier.value = 4.0;
      } else if (BEAN >= 1652 && BEAN < 1664) {
        this.uniforms.multiplier.value = 8.0;
      } else if (BEAN >= 1664 && BEAN < 1680) {
        this.uniforms.multiplier.value = 12.0;
      }

      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
    }

    warmup(renderer) {
      this.update(2626); 
      this.render(renderer);
    }
  }

  global.TilerNode = TilerNode;
})(this);
