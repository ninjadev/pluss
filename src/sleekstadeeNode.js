(function(global) {
  class sleekstadeeNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
      this.blast = 0;
    }

    update(frame) {
      this.blast *= 0.85;
      if(BEAT) { 
        switch(BEAN) {
        case 1321:
        case 1320 + 8:
        case 1416:
        case 1416 + 8:
        case 1512:
        case 1512 + 8:
        case 1584:
        case 1584 + 12:
        case 1584 + 12 + 8:
        case 1584 + 12 + 8 + 12:
          this.blast = .5;
        break;
          default:
        }
      }

      this.uniforms.frame.value = frame;
      this.uniforms.blast.value = this.blast;

    }

    warmup(renderer) {
      this.update(3545);
      this.render(renderer);
    }
  }

  global.sleekstadeeNode = sleekstadeeNode;
})(this);
