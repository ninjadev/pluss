(function(global) {

  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));
  const blacky = '#38202b';

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

      this.ps = new global.ParticleSystem(
        {
          friction: 0.88,
          numParticles: 32,
          life: 35,
          shapes: [
            'JaggedLine',
            'WavyLine',
            'WideRectangle',
          ],
          colors: ['#666']
        }
      );

      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
    }

    update(frame) {
      if (BEAT && BEAN === 2064) {
        for (let i = 0; i < 24; i++) {
          const angle = i / 24 * Math.PI * 2;
          const radius = Math.random();
          this.ps.spawn(
            Math.cos(angle) * radius,  // x
            Math.sin(angle) * radius,  // y
            (0.5 + 0.1 * Math.random()) * Math.cos(angle),  // dx
            (0.5 + 0.1 * Math.random()) * Math.sin(angle),  // dy
            angle,  // rotation
            0,
            0.5
          );
        }
      }

      this.ps.update();

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

      this.ctx.strokeStyle =  blacky;
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
        if(j == 1) {
          const width = .5;
          const h1 = easeOut(0, 9, F(this.frame, 48 + 2112, 24));
          const h2 = easeOut(0, 9, F(this.frame, 48 + 2112 + 12, 24));
          const h3 = easeOut(0, 9, F(this.frame, 48 + 2112 + 24, 24));
          const h4 = easeOut(0, 9, F(this.frame, 48 + 2112 + 24, 12));

          const w1 = easeOut(width, 16 / 4 + width / 2, F(this.frame, 48 + 2208, 12));
          const w2 = easeOut(width, 16 / 4 + width / 2, F(this.frame, 48 + 2208 + 24, 12));
          const w3 = easeOut(width, 16 / 4 + width / 2, F(this.frame, 48 + 2208 + 24 * 2, 12));
          const w4 = easeOut(width, 16 / 4 + width / 2, F(this.frame, 48 + 2208 + 24 * 3, 12));
          this.ctx.save();
          this.ctx.fillStyle = 'white';
          this.ctx.translate(0.15, 0);
          this.ctx.fillRect(-width / 2 - 4, -h1 / 2, w2, h2);
          this.ctx.fillRect(-width / 2, -h2 / 2, width, h1);
          this.ctx.fillRect(-width / 2 + 4, -h4 +4.5, w4, h4);
          this.ctx.restore();

          this.ctx.fillStyle = blacky;
          this.ctx.fillRect(-w1 + width / 2 - 4, -h1 + 4.5, w1, h1);
          this.ctx.fillRect(-width / 2, - 4.5, width, h2);
          this.ctx.fillRect(-w3 + width / 2 + 4, -h3 + 4.5, w3, h3);
          this.ctx.fillStyle = '#fffc00';
        }
        this.ctx.save();
        this.ctx.translate(easeIn(0, -4, F(this.frame, 48 + 2064 - 24 - 8, 4)), 0);
        this.ctx.rotate(Math.PI / 4);
        const hh = easeIn(1, 3, F(this.frame, 48 + 2064 - 4 - 4, 4));
        const scale = easeOut(0, 1.5, F(this.frame, 48 + 2016, 12)) - easeIn(0, 0.5, F(this.frame, 48 + 2016, 12));
        this.ctx.scale(scale, scale);
        this.ctx.strokeStyle = blacky;
        if(j == 1 && BEAN >= 2208 + 48) {
          this.ctx.lineWidth = easeOut(0.5, 1.0, F(this.frame, 48 + 2208, 12));
          this.ctx.strokeRect(-0.5, -hh / 2, 1, hh);
        }
        this.ctx.fillRect(-0.5, -hh / 2, 1, hh);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.rotate(Math.PI / 4);
        this.ctx.beginPath();
        let r = easeIn(0, Math.sqrt(2), F(this.frame, 48 + 2052 - 4, 4));
        this.ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2);
        this.ctx.strokeStyle = blacky;
        if(j == 1 && BEAN >= 2208 + 24 + 48) {
          this.ctx.lineWidth = easeOut(0.5, 1, F(this.frame, 48 + 2208 + 24, 12));
          this.ctx.stroke();
        }
        this.ctx.fill();
        this.ctx.restore();

        this.ctx.save();
        this.ctx.beginPath();

        const h = 2 * Math.sqrt(2);
        const l = h / Math.sin(60 / 180 * Math.PI);
        const targetR = (l/2) / Math.cos(30 / 180 * Math.PI);
        this.ctx.translate(4, -Math.sqrt(2) + targetR); //lerp(+Math.sqrt(2) - targetR, -Math.sqrt(2) + targetR, F(this.frame, 2064  + 8, 4)));
        //this.ctx.rotate(lerp(Math.PI * 2 / 3 / 2, Math.PI * 2 / 3, F(this.frame, 2064 + 8, 4)));
        r = easeIn(0, targetR, F(this.frame, 48 + 2064 -  8, 8));
        for(let i = 0; i < 5; i++) {
          const x = r * Math.sin(i / 3 * Math.PI * 2);
          const y = -r * Math.cos(i / 3 * Math.PI * 2);
          if(i == 0) {
            this.ctx.moveTo(x, y);
          }
          this.ctx.lineTo(x, y);
        }
        this.ctx.strokeStyle = blacky;
        if(j == 1 && BEAN >= 2208 + 48 + 48) {
          this.ctx.lineWidth = easeOut(0.5, 1, F(this.frame, 48 + 2208 + 48, 12));
          this.ctx.stroke();
        }
        this.ctx.fill();
        this.ctx.restore();

        this.ctx.restore();
      }

      this.ctx.globalCompositeOperation = 'difference';
      this.ctx.fillStyle = 'white';
      const width = easeOut(0, 16, F(this.frame, 48 + 2280, 24 - 6));
      const width2 = easeOut(0, 16, F(this.frame, 48 + 2280 + 4, 24 - 8));
      const width3 = easeOut(0, 16, F(this.frame, 48 + 2280 + 8, 24 - 10));
      this.ctx.fillRect(-8, -.5 + -0.5 / 4, width2, 0.25);
      this.ctx.fillRect(-8, -0.5 / 4, width, 0.25);
      this.ctx.fillRect(-8, .5 + -0.5 / 4, width3, 0.25);
      this.ctx.restore();

      this.ctx.fillStyle = '#38202b';
      let vignetteAmount = 0;
      vignetteAmount = easeIn(vignetteAmount, 1, F(this.frame, 2136 - 4, 4));
      vignetteAmount = easeOut(vignetteAmount, 0, F(this.frame, 2160, 4));
      vignetteAmount = easeIn(vignetteAmount, 1, F(this.frame, 2232 - 4, 4));
      vignetteAmount = easeOut(vignetteAmount, 0, F(this.frame, 2256, 4));
      vignetteAmount = easeIn(vignetteAmount, 1, F(this.frame, 2352 - 4, 4));
      vignetteAmount = Math.pow(vignetteAmount, 1.2);
      this.ctx.fillRect(-8, -4.5, 16, 0.119 * 9 * vignetteAmount);

      this.ps.render(this.ctx);

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
