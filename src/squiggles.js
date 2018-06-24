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

      this.lines = [];
      for(let i = 0; i < 32; i++) {
        let x = Math.random() * 16;
        let y = Math.random() * 9;
        const line = [x, y];
        for(let j = 0; j < 2; j++) {
          const r = 0.5 + Math.random();
          const angle = Math.random()  * 2 * Math.PI;
          x += r * Math.cos(angle);
          y += r * Math.sin(angle);
          line.push(x);
          line.push(y);
        }
        this.lines.push(line);

        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 0.005;
        line.dx = Math.cos(angle) * speed;
        line.dy = Math.sin(angle) * speed;
      }
    }

    update(frame) {
      super.update(frame);
      for(let line of this.lines) {
        line[0] += line.dx; 
        line[2] += line.dx; 
        line[4] += line.dx; 
        line[1] += line.dy; 
        line[3] += line.dy; 
        line[5] += line.dy; 
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
