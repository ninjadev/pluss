(function(global) {
  class WaveyPopNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
      this.sync = 0.0;
      this.transition = 0.0;
      this.numBalls = 0.0;
    }

    update(frame) {
      this.sync *= 0.95;
      if (BEAN % 48 == 0) {
        this.sync = 1.0;
      }

      // Fade in and out transition
      if (BEAN == 2688) {
        this.transition = 1.0;
      }
      else if (BEAN >= 2688 && BEAN < 2860) {
        this.transition *= 0.95;
      }
      else if (BEAN == 2860) {
        this.transition = 0.1;
      }
      else if (BEAN >= 2860) {
        this.transition *= 1.1;
      }

      // Number of balls to show
      if (BEAN == 2688) {
        this.numBalls = 0.0;
      }
      else if (BEAN > 2688 && BEAN % 16 == 0) {
        this.numBalls += 1.0;
      }

      this.uniforms.frame.value = frame;
      this.uniforms.sync.value = this.sync;
      this.uniforms.transition.value = this.transition;
      this.uniforms.numBalls.value = this.numBalls;
    }
  }

  global.WaveyPopNode = WaveyPopNode;
})(this);
