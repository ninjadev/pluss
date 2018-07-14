(function(global) {
  class squiggleBackgroundNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
      this.amplitude = 0;
    }

    update(frame) {
      this.uniforms.frame.value = frame;

      this.amplitude *= 0.9;
      if(BEAT && BEAN <= 4272) {
        switch((BEAN - 3600) % (48 * 4)) {
        case 0:
        case 32 - 4:
        case 48 - 4:
        case 48 + 32 - 4:
        case 48 + 48 - 4:
        case 48 + 48 + 12:
        case 48 + 48 + 12 + 8:
        case 48 + 48 + 32 - 4:
        case 48 + 48 + 48 - 4:
        case 48 * 3:
        case 48 * 3 + 8:
        case 48 * 3 + 24 - 4:
        case 48 * 3 + 32 - 4:
        case 48 * 3 + 32:
          this.amplitude = 1;
        }

        this.uniforms.amplitude.value  = this.amplitude;
      }
    }
  }

  global.squiggleBackgroundNode = squiggleBackgroundNode;
})(this);
