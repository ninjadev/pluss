(function(global) {
  class bgrightarrow extends NIN.Node {
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

    warmup(renderer) {
      this.update(6974);
      this.render(renderer);
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

      var colors = ["#FF6666", "#272D33"];

      this.ctx.fillStyle = colors[1];
      this.ctx.rect(-1 * GU , - 1 * GU, 18 * GU, 11 * GU);
      this.ctx.stroke();

      for (var i = 0; i < 31; i++)
      {
        var i_mod = i + (-this.frame/ 20 % 20);
        this.ctx.strokeStyle = colors[0];
        this.ctx.beginPath();
        this.ctx.lineWidth = 0.4 * GU ;
        this.ctx.beginPath();
        this.ctx.moveTo(i_mod * GU, 0);
        for (var j = 0; j < 11; j++)
        {
          this.ctx.lineTo((j % 2) * GU + i_mod * GU, j * GU);
        }
        this.ctx.stroke();
        this.ctx.fill();
      }

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.bgrightarrow = bgrightarrow;
})(this);
