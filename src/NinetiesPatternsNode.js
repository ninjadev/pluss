(function(global) {
  class NinetiesPatternsNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);

      this.patternSize = 0.15;
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.patternSize.value = this.patternSize;
      this.uniforms.effectNum.value = (Math.sin((frame / 60.) * 5.) > 0.) ? 0. : 1.;
    }
  }

  global.NinetiesPatternsNode = NinetiesPatternsNode;
})(this);
