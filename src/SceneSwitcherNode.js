(function(global) {
  class SceneSwitcherNode extends NIN.Node {
    constructor(id) {
      super(id, {
        inputs: {
          A: new NIN.TextureInput(),
          B: new NIN.TextureInput(),
          C: new NIN.TextureInput(),
          D: new NIN.TextureInput(),
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
      this.inputs.D.enabled = false;

      let selectedScene;
      if (BEAN < 48 * 4) {
        selectedScene = this.inputs.A;
      } else if (BEAN < 12 * 4 * 18) {
        selectedScene = this.inputs.B;
      } else if (BEAN < 12 * 4 * 39.5) {
        selectedScene = this.inputs.C;
      } else {
        selectedScene = this.inputs.D;
      }

      selectedScene.enabled = true;
      this.outputs.render.setValue(selectedScene.getValue());
    }
  }

  global.SceneSwitcherNode = SceneSwitcherNode;
})(this);
