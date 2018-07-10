(function(global) {

  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

  class sheipz extends NIN.THREENode {
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

      this.drawWithShadow = (fn) => {
        this.ctx.save();
        const shadowSize = 0.05;
        this.ctx.translate(shadowSize, shadowSize * 3);
        this.ctx.fillStyle = 'blue';
        this.ctx.save();
        fn('blue');
        this.ctx.restore();
        this.ctx.restore();
        this.ctx.save();
        fn();
        this.ctx.restore();
      };
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;
    }

    render() {
      this.ctx.fillStyle = '#ffa6bd';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.save();
      this.ctx.scale(0.25, 0.25);
      this.ctx.translate(2, 2.5);
      this.ctx.rotate(-Math.PI / 4 - Math.PI / 8);
      this.ctx.beginPath();

      const spaceX = 4;
      const spaceY = 4;
      this.ctx.lineWidth = 0.5 / 2 / 2;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      const moving = -(this.frame / 20) % 4;
      this.ctx.translate(-moving, moving);
      for(let i = -16; i < 16; i++) {
        for(let j = 0; j < 20; j++) {
          this.ctx.translate(i * spaceX, j * spaceY);
          this.ctx.moveTo(-1, -1 - 0.5);
          this.ctx.lineTo(-1, 0 - 0.5);
          this.ctx.lineTo(0, 0 - 0.5);
          this.ctx.lineTo(0, 1 - 0.5);
          this.ctx.lineTo(1, 1 - 0.5);
          this.ctx.lineTo(1, 2 - 0.5);
          this.ctx.translate(-i * spaceX, -j * spaceY);
        }
      }

      this.ctx.stroke();
      this.ctx.restore();

      this.ctx.translate(8, 4.5);

      this.ctx.save();
      const shadowSize = 0.15;

      for(let j = 0; j < 2; j++) {
        this.ctx.save();
        this.ctx.fillStyle = '#fffc00';
        if(j == 0) {
          this.ctx.translate(shadowSize * 2, shadowSize);
          this.ctx.fillStyle = '#0e5c49';
        }
        this.ctx.save();
        this.ctx.translate(easeIn(0, -4, F(this.frame, 2064 - 24 - 8, 4)), 0);
        this.ctx.rotate(Math.PI / 4);
        const hh = easeIn(1, 3, F(this.frame, 2064 - 4 - 4, 4));
        const scale = easeOut(0, 1.5, F(this.frame, 2016, 12)) - easeIn(0, 0.5, F(this.frame, 2016, 12));
        this.ctx.scale(scale, scale);
        this.ctx.fillRect(-0.5, -hh / 2, 1, hh);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.rotate(Math.PI / 4);
        this.ctx.beginPath();
        let r = easeIn(0, Math.sqrt(2), F(this.frame, 2052 - 4, 4));
        this.ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        this.ctx.save();
        this.ctx.beginPath();

        const h = 2 * Math.sqrt(2);
        const l = h / Math.sin(60 / 180 * Math.PI);
        const targetR = (l/2) / Math.cos(30 / 180 * Math.PI);
        this.ctx.translate(4, -Math.sqrt(2) + targetR); //lerp(+Math.sqrt(2) - targetR, -Math.sqrt(2) + targetR, F(this.frame, 2064  + 8, 4)));
        //this.ctx.rotate(lerp(Math.PI * 2 / 3 / 2, Math.PI * 2 / 3, F(this.frame, 2064 + 8, 4)));
        r = easeIn(0, targetR, F(this.frame, 2064 -  8, 8));
        for(let i = 0; i < 3; i++) {
          const x = r * Math.sin(i / 3 * Math.PI * 2);
          const y = -r * Math.cos(i / 3 * Math.PI * 2);
          if(i == 0) {
            this.ctx.moveTo(x, y);
          }
          this.ctx.lineTo(x, y);
        }
        this.ctx.fill();
        this.ctx.restore();

        this.ctx.restore();
      }
      this.ctx.restore();

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }
  }

  global.sheipz = sheipz;
})(this);
