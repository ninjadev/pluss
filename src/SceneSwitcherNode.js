(function(global) {
  class SceneSwitcherNode extends NIN.Node {
    constructor(id) {
      super(id, {
        inputs: {
          A: new NIN.TextureInput(),
          B: new NIN.TextureInput(),
          C: new NIN.TextureInput(),
          C_three: new NIN.TextureInput(),
          D: new NIN.TextureInput(),
          E: new NIN.TextureInput(),
          F: new NIN.TextureInput(),
          G: new NIN.TextureInput(),
          H: new NIN.TextureInput(),
          I: new NIN.TextureInput(),
          J: new NIN.TextureInput(),
          K: new NIN.TextureInput(),
          L: new NIN.TextureInput(),
          M: new NIN.TextureInput(),
          N: new NIN.TextureInput(),
          O: new NIN.TextureInput(),
        },
        outputs: {
          render: new NIN.TextureOutput(),
        }
      });
    }

    update() {
      this.inputs.A.enabled = false;
      this.inputs.B.enabled = false;
      this.inputs.C.enabled = false;
      this.inputs.C_three.enabled = false;
      this.inputs.D.enabled = false;
      this.inputs.E.enabled = false;
      this.inputs.F.enabled = false;
      this.inputs.G.enabled = false;
      this.inputs.H.enabled = false;
      this.inputs.I.enabled = false;
      this.inputs.J.enabled = false;
      this.inputs.K.enabled = false;
      this.inputs.L.enabled = false;
      this.inputs.M.enabled = false;
      this.inputs.N.enabled = false;
      this.inputs.O.enabled = false;

      let selectedScene;
      if (BEAN < 48 * 4) {
        selectedScene = this.inputs.A;
      } else if (BEAN < 12 * 4 * 14) {
        selectedScene = this.inputs.B;

      } else if (BEAN < 12 * 4 * 18) {
        selectedScene = this.inputs.L;

      } else if (BEAN < 1056) {
        selectedScene = this.inputs.C;
      } else if (BEAN < 12 * 4 * 31) {
        selectedScene = this.inputs.C_three;
      } else if (BEAN < 12 * 4 * 31.5) {
        selectedScene = this.inputs.C;
      } else if (BEAN < 12 * 4 * 32) {
        selectedScene = this.inputs.C_three;

      } else if (BEAN < 12 * 4 * 33) {
        selectedScene = this.inputs.C;
      } else if (BEAN < 12 * 4 * 34) {
        selectedScene = this.inputs.C_three;

      } else if (BEAN < 12 * 4 * 39) {
        selectedScene = this.inputs.C;
      } else if (BEAN < 12 * 4 * 42) {
        selectedScene = this.inputs.D;
      } else if (BEAN < 12 * 4 * 43.5) {
        selectedScene = this.inputs.N;
      } else if (BEAN < 12 * 4 * 44) {
        selectedScene = this.inputs.O;
      } else if (BEAN < 12 * 4 * 45.5) {
        selectedScene = this.inputs.N;
      } else if (BEAN < 12 * 4 * 46) {
        selectedScene = this.inputs.O;
      } else if (BEAN < 12 * 4 * 48) {
        selectedScene = this.inputs.N;
      } else if (BEAN < 12 * 4 * 56) {
        selectedScene = this.inputs.E;
      } else if (BEAN < 12 * 4 * 70) {
        selectedScene = this.inputs.M;
      } else if (BEAN < 12 * 4 * 72) {
        selectedScene = this.inputs.F;
      } else if (BEAN < 12 * 4 * 80) {
        selectedScene = this.inputs.G;
      } else if (BEAN < 12 * 4 * 90) {
        selectedScene = this.inputs.H;
      } else if (BEAN < 12 * 4 * 98) {
        selectedScene = this.inputs.I;
      } else if (BEAN < 12 * 4 * 100) {
        selectedScene = this.inputs.J;
      } else {
        selectedScene = this.inputs.K;
      }

      selectedScene.enabled = true;
      this.outputs.render.setValue(selectedScene.getValue());
    }
  }

  global.SceneSwitcherNode = SceneSwitcherNode;
})(this);
