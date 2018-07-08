(function(global) {
  class cradle extends NIN.Node {
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

      this.circleEndSize = smoothstep(0, 1, (this.frame - 827) / (996 - 827));

      var colors = ["#729C34", "#265B6A"];

      for (var i = 0; i < 5; i++)
      {
        this.ctx.fillStyle = colors[i % 2];
        this.ctx.strokeStyle = colors[(1 + i) % 2];
        this.ctx.beginPath();
        this.ctx.ellipse(
          -4 * GU + 3 * i * GU,
          4.5 * GU,
          GU + GU * Math.pow((this.frame - FRAME_FOR_BEAN(1152)) / 90, 7),
          GU,
          1, 0, Math.PI * 2);
        this.ctx.lineWidth = 0.5 * GU ;
        this.ctx.stroke();
        this.ctx.fill();
      }

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.cradle = cradle;
})(this);