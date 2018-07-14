(function(global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));
  class sheipzideeNode2 extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    warmup(renderer) {
      this.update(3995);
      this.render(renderer);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.exitAmount2.value = easeIn(0, 1, F(frame, 2784 + 12, 12));
      this.uniforms.exitAmount.value = easeIn(0, 1, F(frame, 2784 + 24, 24));
    }
  }

  global.sheipzideeNode2 = sheipzideeNode2;
})(this);
