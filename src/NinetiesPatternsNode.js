(function(global) {
  class NinetiesPatternsNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);

      this.patternSize = 0.15;
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.patternSize.value = this.patternSize;
      this.uniforms.effectNum.value = 1.;
      if (BEAN >= 1680 && BEAN < 2064) {
        this.uniforms.effectNum.value = 0.0;  // banana pattern
      }
    }
  }

  global.NinetiesPatternsNode = NinetiesPatternsNode;
})(this);
