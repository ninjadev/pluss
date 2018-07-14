(function(global) {
  class upbeatShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
      this.startBEAN = 4512;
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.time.value = (frame - FRAME_FOR_BEAN(this.startBEAN)) / 60.;
      this.uniforms.scene.value = Math.floor((BEAN - this.startBEAN) / 24.);

      this.uniforms.sync.value = Math.floor((BEAN - this.startBEAN) / 24.);
      this.uniforms.invert.value = 0;

      if(BEAN >= 4584 && BEAN < 4608) {
        this.uniforms.invert.value = 1;
        this.uniforms.sync.value = frame;
        if(BEAN >= 4584 + 8) {
          this.uniforms.sync.value = 10000 - frame;
          this.uniforms.invert.value = 0.1;
        }
      }

      if(BEAN >= 4680 && BEAN < 4704) {
        this.uniforms.invert.value = 1;
        this.uniforms.sync.value = frame;
        if(BEAN >= 4680 + 8) {
          this.uniforms.sync.value = 10000 - frame;
          this.uniforms.invert.value = 0.1;
        }
      }
    }
  }

  global.upbeatShaderNode = upbeatShaderNode;
})(this);
