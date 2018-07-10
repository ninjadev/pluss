(function(global) {
  class bgzigzag extends NIN.Node {
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

      var colors = ["#DAD4EA", "#181D16"];
      this.ctx.fillStyle = colors[1];
      this.ctx.rect(-1 * GU , - 1 * GU, 18 * GU, 11 * GU);
      this.ctx.stroke();

      for (var i = 0; i < 10; i++)
      {
        this.ctx.strokeStyle = colors[0];
        this.ctx.beginPath();
        this.ctx.lineWidth = 0.35 * GU ;
        this.ctx.beginPath();
        this.ctx.moveTo(0,i * GU);
        for (var j = 0; j < 14; j++)
        {
          this.ctx.lineTo(j * GU * 1.6, (j % 2) * GU + i * GU);
        }
        this.ctx.stroke();
      }

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.bgzigzag = bgzigzag;
})(this);