(function(global) {
  class squiggles extends NIN.THREENode {
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

      this.makeNewLines();

    }

    makeNewLines() {
      this.lines = [];
      for(let i = 0; i < 20; i+=2) {
        for(let j = 0.1; j < 100; j+=2) {
          const r =  0.2;
          const angle = Math.random() * Math.PI * 2;
          let x = i + r * Math.sin(angle);
          let y = j + r * Math.cos(angle);
          const line = [x, y];
          for(let k = 0; k < 2; k++) {
            const r = 0.5 + Math.random() * 0.25;
            const angle = Math.random()  * 2 * Math.PI;
            if(k == 0) {
              line.unshift(y + r * Math.sin(angle));
              line.unshift(x + r * Math.cos(angle));
            } else {
              line.push(x + r * Math.cos(angle));
              line.push(y + r * Math.sin(angle));
            }
          }
          this.lines.push(line);

          line.dx = 0;
          line.dy = 0;
        }
      }
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;

      if(BEAT && BEAN % 24 == 0) {
        this.makeNewLines();
      }
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {

      this.ctx.fillStyle = '#009ace';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.translate(0, -this.frame / 100);

      this.ctx.save();


      this.ctx.translate(0.05, 0.15);
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#082244';
      this.ctx.globalAlpha = 0.8;
      this.ctx.lineWidth = 0.2;
      this.ctx.lineCap = 'round';
      for(let i = 0; i < this.lines.length; i++) {
        const line = this.lines[i];
        this.ctx.moveTo(line[0], line[1]);
        this.ctx.lineTo(line[2], line[3]);
        this.ctx.moveTo(line[2], line[3]);
        this.ctx.lineTo(line[4], line[5]);
      }
      this.ctx.stroke();
      this.ctx.restore();

      this.ctx.beginPath();
      this.ctx.strokeStyle = '#ff3eb5';
      this.ctx.lineWidth = 0.2;
      this.ctx.lineCap = 'round';
      for(let i = 0; i < this.lines.length; i++) {
        const line = this.lines[i];
        this.ctx.moveTo(line[0], line[1]);
        this.ctx.lineTo(line[2], line[3]);
        this.ctx.moveTo(line[2], line[3]);
        this.ctx.lineTo(line[4], line[5]);
      }
      this.ctx.stroke();

      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.squiggles = squiggles;
})(this);
