(function(global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));
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

      const BEAT1 = 5184;
      const BEAT2 = 5184 + 20;
      const BEAT3 = BEAT1 + 48;
      const BEAT4 = BEAT2 + 48;
      const BEAT5 = BEAT1 + 96;
      const BEAT6 = BEAT5 + 12;
      const BEAT7 = BEAT6 + 18;



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

        // slides
        if (BEAN < BEAT2) {
          patternA = this.CRAZY;
          patternB = this.ZEBRA;
          currentTransition = this.LEFT_TO_RIGHT;
          transitionLerp = easeOut(0, 1, F(frame,BEAT1,24));
        }
        else if (BEAN < BEAT3) {
          patternA = this.ZEBRA;
          patternB = this.GEOPARD;
          currentTransition = this.RIGHT_TO_LEFT;
          transitionLerp = easeOut(0, 1, F(frame,BEAT2,24));
        }
        else if (BEAN < BEAT4) {
          patternA = this.GEOPARD;
          patternB = this.CRAZY;
          currentTransition = this.LEFT_TO_RIGHT;
          transitionLerp = easeOut(0, 1, F(frame,BEAT3,24));
        }
        else if (BEAN < BEAT5) {
          patternA = this.CRAZY;
          patternB = this.BANANA;
          currentTransition = this.RIGHT_TO_LEFT;
          transitionLerp = easeOut(0, 1, F(frame,BEAT4,24));
        }
        else if (BEAN < BEAT6) {
          patternA = this.BANANA;
          patternB = this.GEOPARD;
          currentTransition = this.LEFT_TO_RIGHT;
          transitionLerp = easeOut(0, 1, F(frame,BEAT5,24));
        }
        else if (BEAN < BEAT7) {
          patternA = this.GEOPARD;
          patternB = this.ZEBRA;
          currentTransition = this.RIGHT_TO_LEFT;
          transitionLerp = easeOut(0, 1, F(frame,BEAT6,24));
        }
        else if (BEAN < 5316) {
          patternA = this.CRAZY;
          patternB = this.BANANA;
          currentTransition = this.LEFT_TO_RIGHT
          transitionLerp = easeOut(0, 1, F(frame,BEAT7,24));
        }
        // 132 beans. last swipe to banana
        //bang bang bang
        if (BEAN >= 5316){
          currentTransition = this.NONE;
          patternA = (BEAN / 4 | 0 ) % 4

        }
        // else if (BEAN < MTV_BEAN + (SYNC_BEAN * 5)) {
        //   patternA = this.BANANA;
        //   currentTransition = this.NONE;
        // }
        // else if (BEAN < MTV_BEAN + (SYNC_BEAN * 5.5)) {
        //   patternA = this.CRAZY;
        //   currentTransition = this.NONE;
        // }
        // else if (BEAN < MTV_BEAN + (SYNC_BEAN * 6)) {
        //   patternA = this.ZEBRA;
        //   currentTransition = this.NONE;
        // }
        // else if (BEAN < MTV_BEAN + (SYNC_BEAN * 6.5)) {
        //   patternA = this.GEOPARD;
        //   currentTransition = this.NONE;
        // }

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
