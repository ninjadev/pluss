(function(global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));
  class every extends NIN.THREENode {
    constructor(id) {
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

    update(frame) {
      super.update(frame);
      this.frame = frame;
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.save();
      if(BEAN >= 288 && BEAN < 480) {
        this.ctx.translate(8, 4.5);
        let scale = 1 + (this.frame - FRAME_FOR_BEAN(288)) / 60 / 60 * 190 / 4 / 4 / 2;
        scale = Math.exp(scale) / 2.3;
        scale = easeIn(scale, 1, F(this.frame, 432 -4, 4));
        this.ctx.scale(scale, scale);
        let rotation = ((this.frame - FRAME_FOR_BEAN(288)) / 900) % Math.PI * 2;
        rotation = easeIn(rotation, Math.PI / 4, F(this.frame, 432 -4, 4));
        if(BEAN >= 432) {
          rotation = 0;
        }
        this.ctx.rotate(rotation);
        this.ctx.translate(-8, -4.5);
      }

      this.ctx.fillStyle = 'white';
      for(let i = -1; i < 17; i++) {
        for(let j = -1; j < 10; j++) {
          this.ctx.save();
          this.ctx.globalCompositeOperation = 'xor';
          this.ctx.translate(i + 1 / 2, j + 1 / 2);
          let rotation = easeOut(0, Math.PI / 4, F(this.frame, 264, 12));
          this.ctx.rotate(rotation);
          let size = easeOut(0.9, 0.5, F(this.frame, 264, 12));
          size = easeOut(size, 1.2, F(this.frame, 264 + 24, 12));
          size = easeIn(size, 4.95, F(this.frame, 432 -4, 4));
          size = easeIn(size, 6, F(this.frame, 432 + 24 -4, 4));
          if(BEAN >= 480) {
            const thisSize = ((BEAN  - 480) / 24 | 0) + 7;
            const previousSize = size  - 1;
            size = easeIn(previousSize * Math.sqrt(2), thisSize * Math.sqrt(2), F(this.frame, (BEAN - (BEAN % 24)) -4, 4));
          }
          size = easeIn(0, size, F(this.frame, 96 - 12 - 17 + i - 10 + j, 12));
          this.ctx.fillRect(-size / 2, -size / 2, size, size);
          this.ctx.restore();
        }
      }
      this.ctx.restore();

      this.ctx.translate(8, 4.5);

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.every = every;
})(this);
