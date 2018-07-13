(function(global) {
  class NinetiesPatternsNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);

      // Textures
      this.BANANA = 0;
      this.ZEBRA = 1;
      this.GEOPARD = 2;
      this.CRAZY = 3;

      // Transitions
      this.NONE = 0;
      this.MIX = 1;
      this.LEFT_TO_RIGHT = 2;
      this.RIGHT_TO_LEFT = 3;

      // Control banana size
      this.patternSize = 0.15;

      // Control banana speed
      this.patternSpeed = 0.5;
    }

    update(frame) {
      let currentTransition = this.NONE;
      let transitionLerp = 0.;
      let patternA = this.BANANA;
      let patternB = this.BANANA;


      //
      // TIMINGS
      //
      let YOYO_BEAN = 2064;
      let MTV_BEAN = 5184;

      // `yoyo` aka Round nipple pop
      if (BEAN < YOYO_BEAN) {
        patternA = this.BANANA;
      }

      // Placeholder
      else if (BEAN < MTV_BEAN) {}

      // `SpinningCube` aka MTV scene
      else if (BEAN < MTV_BEAN + 2000000) {
        let SYNC_BEAN = 24;

        let syncLerp = (num) => {
          let result = 1. - (FRAME_FOR_BEAN(MTV_BEAN + SYNC_BEAN * num) - frame) / FRAME_FOR_BEAN(SYNC_BEAN);
          if (result < 0) {
            return 0;
          }
          return result;
        }

        if (BEAN < MTV_BEAN + SYNC_BEAN) {
          patternA = this.CRAZY;
          patternB = this.ZEBRA;
          currentTransition = this.LEFT_TO_RIGHT;
          transitionLerp = syncLerp(1);
        }
        else if (BEAN < MTV_BEAN + (SYNC_BEAN * 2)) {
          patternA = this.ZEBRA;
          patternB = this.GEOPARD;
          currentTransition = this.LEFT_TO_RIGHT;
          transitionLerp = syncLerp(2);
        }
        else if (BEAN < MTV_BEAN + (SYNC_BEAN * 3)) {
          patternA = this.GEOPARD;
          patternB = this.CRAZY;
          currentTransition = this.RIGHT_TO_LEFT;
          transitionLerp = syncLerp(3);
        }
        else if (BEAN < MTV_BEAN + (SYNC_BEAN * 4)) {
          patternA = this.CRAZY;
          patternB = this.BANANA;
          currentTransition = this.RIGHT_TO_LEFT;
          transitionLerp = syncLerp(4);
        }
      }


      this.uniforms.patternA.value = patternA;
      this.uniforms.patternB.value = patternB;
      this.uniforms.currentTransition.value = currentTransition;
      this.uniforms.transitionLerp.value = transitionLerp;
      this.uniforms.frame.value = frame;
      this.uniforms.patternSize.value = this.patternSize;
      this.uniforms.patternSpeed.value = this.patternSpeed;
    }
  }

  global.NinetiesPatternsNode = NinetiesPatternsNode;
})(this);
