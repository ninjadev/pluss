(function(global) {
  class IntroNode extends NIN.Node {
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

      this.dots_per_level = 10; // This is how many dots before we branch
      this.dots = 268;
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
      this.ctx.globalCompositeOperation = 'xor';
    }

    update(frame) {
      const firstFrameOfGrowth = 6125;
      // const maxTreeSize = 10 * this.dots_per_level;
      const maxTreeSize = 7 * this.dots_per_level;
      this.frame = frame;

      // 6125 is the frame when the tree starts to grow
      // The mod operator defines when the size restarts
      // ToDo : cap the dots at a multiple of dots_per_level?

      if(frame < firstFrameOfGrowth + maxTreeSize - 1)
      // if(this.dots < maxTreeSize)
      {
        this.dots = (frame - firstFrameOfGrowth);
      }
      else{
        this.dots = maxTreeSize -2;
      }
    }

    renderShape(ctx, shape) {
      ctx.fill();
    }

    render(renderer) {
      this.ctx.globalCompositeOperation = 'xor';
      this.ctx.clearRect(0, 0, 16 * GU, 9 * GU);

      const r = 140;
      const g = 150;
      const b = 90;
      this.ctx.fillStyle = `rgb(${r|0}, ${g|0}, ${b|0})`;

      /*for(var level = 0; level < this.dots / this.dots_per_level; level++) {
        var dots_on_level = Math.min(this.dots_per_level, this.dots - this.dots_per_level * level);
        for (var dot = 0; dot < dots_on_level; dot++) {
          var branches = Math.pow(2, level);
          for(var branch = 0; branch < branches; branch++) {
            this.ctx.beginPath();
            this.ctx.ellipse(
              8 * GU + (branch / branches ) * GU * 8,
              8.9 * GU - (level * this.dots_per_level + dot) * GU * 0.05 - level * GU * 0.06,
              0.02 * GU,
              0.02 * GU,
              0, 0, Math.PI * 2);
            this.ctx.fill();
          }
        }
      }*/

      var draw_branch = function(x, y, dots_remaining, dots_per_level, angle, level, ctx) {
        var dx = 1.5 * Math.sin(angle) * (12 - level) / 12;
        var dy = 1.5 * Math.cos(angle) * (12 - level) / 12;
        if (dots_remaining > dots_per_level)
        {
          draw_branch(x + dx, y + dy, dots_remaining - dots_per_level, dots_per_level, angle - 0.65, level + 1, ctx);
          draw_branch(x + dx, y + dy, dots_remaining - dots_per_level, dots_per_level, angle + 0.65, level + 1, ctx);
        }
        for (var dot = 1; dot <= Math.min(dots_remaining, dots_per_level); dot++) {
          var progression = Math.min(10, dots_remaining - dot);
          // The yellow of the stars.js scene is currently rgb(250, 231, 103) (#fae767).
          var nr = 250 - progression * r / 10;
          var ng = 231 - progression * g / 10;
          var nb = 103 - progression * b / 10;
          const calcX = GU * (8 + x + dot / dots_per_level * dx * (1 +  Math.sin(dot / dots_per_level * Math.PI) * 0.3 * (level%2?1:-1)));
          const calcY = GU * (8.9 - y - dot / dots_per_level * dy) - GU;
          if(calcX <= 8 * GU) {
              ctx.fillStyle = `rgb(${nr|0}, ${ng|0}, ${nb|0})`;
              const scalingFactor = 0.04;
              ctx.fillRect(calcX, calcY, scalingFactor * GU, scalingFactor * GU);
              /*
              ctx.beginPath();
              ctx.ellipse(
                calcX,
                calcY,
                0.02 * GU,
                0.02 * GU,
                0, 0, Math.PI * 2);
              //ctx.closePath();
              ctx.fill();
              */
          }
        }
        return;
      }

      draw_branch(0, 0, this.dots, this.dots_per_level, 0, 1, this.ctx);

      this.ctx.save();
      this.ctx.translate(8 * GU, 4.5 * GU);
      this.ctx.scale(-1, 1);
      this.ctx.translate(-8 * GU, -4.5 * GU);
      this.ctx.drawImage(this.canvas, 0, 0);
      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.IntroNode = IntroNode;
})(this);
