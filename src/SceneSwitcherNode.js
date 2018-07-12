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
          D_transision: new NIN.TextureInput(),
          E: new NIN.TextureInput(),
          F: new NIN.TextureInput(),
          G: new NIN.TextureInput(),
          H: new NIN.TextureInput(),
          I: new NIN.TextureInput(),
          I_bg: new NIN.TextureInput(),
          J: new NIN.TextureInput(),
          K: new NIN.TextureInput(),
          L: new NIN.TextureInput(),
          M: new NIN.TextureInput(),
          N: new NIN.TextureInput(),
          O: new NIN.TextureInput(),
          P: new NIN.TextureInput(),
          Q: new NIN.TextureInput(),
          R: new NIN.TextureInput(),
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
      this.inputs.D_transision.enabled = false;
      this.inputs.E.enabled = false;
      this.inputs.F.enabled = false;
      this.inputs.G.enabled = false;
      this.inputs.H.enabled = false;
      this.inputs.I.enabled = false;
      this.inputs.I_bg.enabled = false;
      this.inputs.J.enabled = false;
      this.inputs.K.enabled = false;
      this.inputs.L.enabled = false;
      this.inputs.M.enabled = false;
      this.inputs.N.enabled = false;
      this.inputs.O.enabled = false;
      this.inputs.P.enabled = false;
      this.inputs.Q.enabled = false;
      this.inputs.R.enabled = false;

      let selectedScene;  
      if (BEAN < 48 * 18) {
        selectedScene = this.inputs.A;
      } else if (BEAN < 12 * 4 * 27) {
        selectedScene = this.inputs.C;
      } else if (BEAN < 12 * 4 * 40.5) {
        selectedScene = this.inputs.D;
      } else if (BEAN < 12 * 4 * 43) {
        selectedScene = this.inputs.D_transision;
      } else if (BEAN < 12 * 4 * 44.5) {
        selectedScene = this.inputs.N;
      } else if (BEAN < 12 * 4 * 45) {
        selectedScene = this.inputs.O;
      } else if (BEAN < 12 * 4 * 46.5) {
        selectedScene = this.inputs.N;
      } else if (BEAN < 12 * 4 * 47) {
        selectedScene = this.inputs.O;
      } else if (BEAN < 12 * 4 * 49) {
        selectedScene = this.inputs.N;
      } else if (BEAN < 12 * 4 * 51) {
        selectedScene = this.inputs.O;
      } else if (BEAN < 12 * 4 * 52.5) {
        selectedScene = this.inputs.Q;
      } else if (BEAN < 12 * 4 * 53) {
        selectedScene = this.inputs.R;
      } else if (BEAN < 12 * 4 * 54) {
        selectedScene = this.inputs.Q;
      } else if (BEAN < 12 * 4 * 55) {
        selectedScene = this.inputs.R;
      } else if (BEAN < 12 * 4 * 57) {
        selectedScene = this.inputs.Q;
      } else if (BEAN < 12 * 4 * 59) {
        selectedScene = this.inputs.R;
      } else if (BEAN < 12 * 4 * 59) {
        selectedScene = this.inputs.P;
      } else if (BEAN < 12 * 4 * 67) {
        selectedScene = this.inputs.M;
      } else if (BEAN < 12 * 4 * 72) {
        selectedScene = this.inputs.F;
      } else if (BEAN < 12 * 4 * 75) {
        selectedScene = this.inputs.G;
      } else if (BEAN < 12 * 4 * 83) {
        selectedScene = this.inputs.I;
      } else if (BEAN < 12 * 4 * 90) {
        selectedScene = this.inputs.I_bg;
      } else if (BEAN < 12 * 4 * 98) {
        selectedScene = this.inputs.K;
      } else if (BEAN < 12 * 4 * 102) {
        selectedScene = this.inputs.J;
      } else if (BEAN < 12 * 4 * 108) {
        selectedScene = this.inputs.L ;
      } else {
        selectedScene = this.inputs.B;
      }

      selectedScene.enabled = true;
      this.outputs.render.setValue(selectedScene.getValue());
    }
  }

  global.SceneSwitcherNode = SceneSwitcherNode;
})(this);
