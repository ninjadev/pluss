(function(global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));
  class discyblob extends NIN.THREENode {
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

      this.hihat = 0;
      this.booms = [];
      for(let i = 0; i < 24; i++) {
        this.booms[i] = 0;
      }
      this.i = 0;

      this.blaster = 0;
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;

      this.blaster *= 0.7;
      for(let i = 0; i < this.booms.length; i++) {
        this.booms[i] *= 0.8;
        this.booms[i] = Math.max(this.booms[i], 0.1);
      }

      this.hihat *= 0.9;

      if(BEAT) {
        if(BEAN % 24 == 12) {
          this.hihat = 1; 
        }
      }

      const i = BEAN % 24;
      if(BEAT && BEAN >= 96) {
        switch(i) {
        case 4:
        case 6:
        case 8:
        case 10:
        case 14:
        case 16:
        case 18:
        case 20:
        case 22:
          this.blaster = 1;
          break;
        default:
          break;
        }
        this.booms[i] = this.blaster;
      }
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.translate(8, 4.5);
      const r = easeIn(0, 2.8 + this.hihat * 0.2, F(this.frame, 96 - 12, 12));
      this.ctx.fillStyle = 'white';
      this.ctx.save();
      this.ctx.fillStyle = '#222';
      this.ctx.translate(0.45, 0.15);
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#222';
      this.ctx.strokeStyle = '#222';
      this.ctx.lineWidth = 0.02;
      for(let j = 0; j < 2; j++) {
        if(BEAN < 96) {
          break;
        }
        let x; let y;
        for(let i = 0; i < this.booms.length; i++) {
          const angle = Math.PI * 2 * i / this.booms.length;
          let r = 2 * Math.abs(Math.sin(angle * ((BEAN) / 48  | 0)));
          if(BEAN < 96) {
            r = 1;
          }
          r = easeIn(0, r, F(this.frame, 96 - 12, 12));
          x = r * Math.cos(angle);
          y = r * Math.sin(angle);
          const size = Math.max(0.05, 0.5 * this.booms[i]);
          if(j == 0) {
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, size, size, 0, 0, Math.PI * 2);
            this.ctx.fill();
          } else {
            if(i == 0) {
              this.ctx.beginPath();
              this.ctx.moveTo(x, y);
            }
            this.ctx.lineTo(x, y);
          }
        }
        if(j == 1) {
          this.ctx.lineTo(0, 0);
          this.ctx.stroke();
        }
      }


      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.discyblob = discyblob;
})(this);
