(function(global) {
  class WaveyPopNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);

      this.sync = 0.0;
      this.transition = 2.0;
      this.numBalls = 0;

      // Sync related, change these to match
      // start and end BEANs of the placement of this scene
      this.startBEAN = 4896;
      this.endBean = 5177;

      // Settings
      this.ballBEANsync = 24;
      this.startBallBEAN = this.startBEAN + this.ballBEANsync * 4;
      this.transitionBEANS = 24;
      this.maxBalls = 4;
      this.fromColor = new THREE.Vector3(0., 1., 0.7725490196078432);
      this.toColor = new THREE.Vector3(0., 0.6039215686274509, 0.807843137254902);
    }

    update(frame) {
      this.sync *= 0.95;
      if (BEAN % 48 === 0) {
        this.sync = 1.0;
      }

      var transitionColor = this.fromColor;
      if (BEAN > this.endBean - this.transitionBEANS) {
        transitionColor = this.toColor;
      }


      // HACK to ensure transition value is set independent on BEAN
      if (frame < FRAME_FOR_BEAN(this.startBEAN)) {
        this.transition = 2.;
      }

      // Fade in and out transition
      if (BEAN === this.startBEAN) {
        this.transition = 2.0;
      }
      else if (BEAN >= this.startBEAN && BEAN < (this.endBean - this.transitionBEANS)) {
        this.transition *= 0.975;
      }
      else if (BEAN === (this.endBean - this.transitionBEANS)) {
        this.transition = 0.1;
      }
      else if (BEAN >= (this.endBean - this.transitionBEANS)) {
        this.transition *= 1.1;
      }

      // Number of balls to show
      this.numBalls = Math.floor((
        (BEAN - this.startBallBEAN) / this.ballBEANsync)
      );



      if (this.numBalls > this.maxBalls) {
        this.numBalls = this.maxBalls;
      }

      this.uniforms.frame.value = frame;
      this.uniforms.sync.value = this.sync;
      this.uniforms.transition.value = this.transition;
      this.uniforms.numBalls.value = this.numBalls;

      this.uniforms.transCol.value = transitionColor;


      let scene = 0.;
      if (BEAN > this.endBean) {
        scene = 1.;
      }

      this.uniforms.scene.value =  scene;
      this.uniforms.crazySpeed.value = 0.25 + Math.floor((BEAN - this.endBean) / 24) * 0.75;
    }
  }

  global.WaveyPopNode = WaveyPopNode;
})(this);
