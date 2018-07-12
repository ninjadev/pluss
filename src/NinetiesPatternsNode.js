(function(global) {
  class NinetiesPatternsNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);

      // Control banana size
      this.patternSize = 0.15;

      // Control banana speed
      this.patternSpeed = 0.5;
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.patternSize.value = this.patternSize;
      this.uniforms.patternSpeed.value = this.patternSpeed;

      this.uniforms.effectNum.value = 0.;
    }
  }

  global.NinetiesPatternsNode = NinetiesPatternsNode;
})(this);
