(function(global) {
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

      const i = BEAN % 24;
      if(BEAT) {
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
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.fillStyle = '#ccc';
      const width = 0.02;
      for(let i = 0; i < 19; i++) {
        const x = i / 19  * 16;
        this.ctx.fillRect(x - width / 2, 0, width, 9);
      }
      for(let j = 0; j < 9; j++) {
        const y = j / 9 * 9;
        this.ctx.fillRect(0, y - width / 2, 16, width);
      }

      this.ctx.translate(8, 4.5);

      this.ctx.fillStyle = 'pink';
      for(let j = 0; j < 2; j++) {
        this.ctx.save();
        const shadowSize = 0.05;
        if(j == 0) {
          this.ctx.translate(shadowSize * 3, shadowSize);
          this.ctx.fillStyle = 'black';
        }
        for(let i = 0; i < this.booms.length; i++) {
          const angle = Math.PI * 2 * i / this.booms.length;
          const r = 3 * Math.abs(Math.sin(angle * ((BEAN - 48) / 48  | 0)));
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);
          const size = 0.5 * this.booms[i];
          this.ctx.beginPath();
          this.ctx.ellipse(x, y, size, size, 0, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      }

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.every = every;
})(this);
