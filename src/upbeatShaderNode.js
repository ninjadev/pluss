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
    }
  }

  global.upbeatShaderNode = upbeatShaderNode;
})(this);
