(function(global) {
  class bgblue extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
      this.ctx.globalCompositeOperation = 'xor';
    }

    update(frame) {
      this.frame = frame;
    }

    renderShape(ctx, shape) {
      ctx.fill();
    }

    render(renderer) {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.clearRect(0, 0, 16 * GU, 9 * GU);

      this.ctx.fillStyle = "#08CAED";
      this.ctx.rect(-1 * GU , - 1 * GU, 18 * GU, 11 * GU);
      this.ctx.fill();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.bgblue = bgblue;
})(this);