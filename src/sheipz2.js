(function(global) {

  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

  class sheipz2 extends NIN.THREENode {
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
      this.bgbeat = 0;
    }

    warmup(renderer) {
      this.ctx.update(3952);
      this.ctx.render(renderer);
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;
      this.bgbeat *= 0.95;
      if(BEAT && BEAN % 24 == 12) {
        this.bgbeat = 1;
      }
    }

    render() {
      this.ctx.fillStyle = '#75d2d9';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.save();
      this.ctx.beginPath();

      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      const r = 0.2 + 0.1 * this.bgbeat;
      this.ctx.save();
      this.ctx.translate(8, 4.5);
      this.ctx.rotate(this.frame / 100);
      for(let i = -16; i < 16; i++) {
        for(let j = -10; j < 10; j++) {
          const x = i * 1.1;
          const y = 0.5 * (i % 2) + j * 1.1;
          const rr = r + 0.05 * Math.sin(i / 2 + this.frame / 10);
          this.ctx.moveTo(x, y);
          this.ctx.ellipse(
              x, y,
              rr + 0.25 * Math.abs(x) / 16,
              rr + 0.25 * Math.abs(y) / 16,
              i * Math.PI * 2 / 4 + this.frame / 60 / 60 * 190,
              0,
              Math.PI * 3 / 2);
        }
      }
      //this.ctx.fill();
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 0.05;
      this.ctx.stroke();
      this.ctx.restore();

      this.ctx.translate(8, 4.5);

      for(let j = 0; j < 2; j++) {
        this.ctx.fillStyle = '#00ffc6';
        const shadowSize = 0.1;
        const r = 0.8;
        this.ctx.save();
        if(j == 0) {
          this.ctx.fillStyle = '#fff600';
          this.ctx.translate(shadowSize * 2, shadowSize);
        }
        this.ctx.beginPath();
        for(let i = 0; i < 5; i++) {
          const angle = this.frame / 60 / 60 * 190 / 4 / 5 * Math.PI * 2 + i / 5 * Math.PI * 2;
          const radius = 1 * Math.sin(i / 5 + this.frame / 60 / 60 * 190 / 4 * Math.PI * 2) * 3;
          const x = radius * Math.sin(angle);
          const y = radius * Math.cos(angle);
          if(BEAN >=2544) {
            const s = Math.sqrt(r * 2);
            this.ctx.fillRect(x - s / 2, y - s / 2, s, s);
          } else {
            this.ctx.moveTo(x, y);
            this.ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
          }
        }
        this.ctx.fill();
        this.ctx.restore();
      }


      this.ctx.restore();

      this.ctx.translate(8, 4.5);

      this.ctx.save();

      for(let j = 0; j < 2; j++) {
        this.ctx.save();
        this.ctx.fillStyle = '#fffc00';
        this.ctx.restore();
      }

      this.ctx.restore();

      this.ctx.fillStyle = '#0f4e55';
      let vignetteAmount = 0;
      vignetteAmount = easeIn(vignetteAmount, 1, F(this.frame, 2520 - 4, 4));
      vignetteAmount = easeOut(vignetteAmount, 0, F(this.frame, 2544, 4));
      vignetteAmount = easeIn(vignetteAmount, 1, F(this.frame, 2592 - 4, 4));
      vignetteAmount = easeOut(vignetteAmount, 0, F(this.frame, 2640, 4));
      vignetteAmount = easeIn(vignetteAmount, 1, F(this.frame, 2736 - 4, 4));
      vignetteAmount = Math.pow(vignetteAmount, 1.2);
      this.ctx.fillRect(-8, -4.5, 16, 0.119 * 9 * vignetteAmount);

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }
  }

  global.sheipz2 = sheipz2;
})(this);
