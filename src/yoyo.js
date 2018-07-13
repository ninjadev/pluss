(function(global) {

  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

  class yoyo extends NIN.THREENode {
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

      this.square = () => {
        this.ctx.fillRect(-0.5, -0.5, 1, 1);
      };

      this.triangle = () => {
        this.ctx.beginPath();
        const radius = 1 / Math.sqrt(2);
        for(let i = 0; i < 3; i++) {
          const angle = Math.PI * 2 * i / 3;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          if(i == 0) {
            this.ctx.moveTo(x, y);
          }
          this.ctx.lineTo(x, y);
        }
        this.ctx.fill();
      };

      this.circle = () => {
        this.ctx.beginPath();
        const radius = 1 / Math.sqrt(2);
        this.ctx.ellipse(0, 0, radius, radius, 0, 0, Math.PI * 2);
        this.ctx.fill();
      };
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

      // This clears the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.translate(8, 4.5);
      const cameraZoom = smoothstep(0.1, 1, F(this.frame, 1296, 12));
      this.ctx.scale(cameraZoom, cameraZoom);

      const green = '#00ffc6';
      const yellow = '#fffc00';
      const pink = '#ff00ea';
      const lightPink = '#f442e8';

      const colorsList = [
        [lightPink, yellow, pink, green],
        [green, lightPink, yellow, pink],
        [pink, green, lightPink, yellow],
        [yellow, pink, green, lightPink],
        [lightPink, yellow, pink, green],
        [green, lightPink, yellow, pink],
        [pink, green, lightPink, yellow],
        [yellow, pink, green, lightPink],
        [lightPink, yellow, pink, green],
        [green, lightPink, yellow, pink],
        [pink, green, lightPink, yellow],
        [yellow, pink, green, lightPink],

        [green, lightPink, yellow, pink],
      ];

      let colors = colorsList[0];
      if(BEAN >= 4392) {
        colors = colorsList[8];
      } else if(BEAN >= 33 * 48) {
        colors = colorsList[8];
      } else if(BEAN >= 32.5 * 48 - 4) {
        colors = colorsList[7];
      } else if(BEAN >= 31* 48) {
        colors = colorsList[6];
      } else if(BEAN >= 30.5 * 48 + 8) {
        colors = colorsList[5];
      } else if(BEAN >= 30.5 * 48) {
        colors = colorsList[4];
      } else if(BEAN >= 29 * 48) {
        colors = colorsList[3];
      } else if(BEAN >= 28.5 * 48 + 8) {
        colors = colorsList[2];
      } else if(BEAN >= 28.5 * 48) {
        colors = colorsList[1];
      }


      this.ctx.save();
      this.ctx.fillStyle = colors[0];
      this.ctx.scale(1 / cameraZoom, 1 / cameraZoom);

      const drawOwnBackground = BEAN < 1680;
      if (drawOwnBackground) {
        this.ctx.fillRect(-80, -4.5, 160, 9);

        this.ctx.save();
        this.ctx.translate(-4 * 8, 0);
        this.ctx.translate(16 - 4.4 -(this.frame - 2045) / 100, 0);
        this.ctx.rotate(Math.PI / 16);

        const shadowSize = 0.3;
        const shadowColor = 'rgba(0, 0, 0, 0.3)';

        for(let i = 0; i < 8; i++) {
          this.ctx.translate(4, 0);
          this.ctx.fillStyle =  i % 2 ? '#00befc' : 'white';
          this.ctx.fillRect(4, -100, 5, 200);
          this.ctx.fillStyle = shadowColor;
          this.ctx.fillRect(4, -100, shadowSize, 200);
        }
        this.ctx.restore();
      }

      this.ctx.restore();

      let shape = this.square;

      if(BEAN >= 31 * 48) {
        shape = this.circle;
      } else if(BEAN >= 29 * 48) {
        shape = this.triangle;
      }

      for(let i = 0; i < 3; i++) {
        this.ctx.save();
        let scale = 1 + (3 - i) + 0.5 * Math.sin(this.frame * Math.PI * 2 / 60 / 60 * 190 / 2);
        if(i == 2) {
          scale = 0.5 + (3 - i) - 0.25 * Math.sin(this.frame * Math.PI * 2 / 60 / 60 * 190 / 2);
        }
        this.ctx.scale(scale, scale);
        this.ctx.fillStyle = 'rgba(0,0,0,0.85)';
        this.ctx.save();
        const shadowSize = 0.15;
        this.ctx.translate(shadowSize / scale, shadowSize / scale);
        this.ctx.rotate(Math.PI / 4 + this.frame / 50);
        shape();
        this.ctx.restore();
        this.ctx.rotate(Math.PI / 4 + this.frame / 50);
        this.ctx.fillStyle = colors[1 + i];
        shape();
        this.ctx.restore();
      }



      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.yoyo = yoyo;
})(this);
