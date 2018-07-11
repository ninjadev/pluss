(function(global) {
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
      const cameraZoom = smoothstep(0.1, 1, (this.frame - FRAME_FOR_BEAN(4320)) / (FRAME_FOR_BEAN(4332) - FRAME_FOR_BEAN(4320)))
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
        colors = colorsList[1];
      }
      if(BEAN >= 4392 + 8) {
        colors = colorsList[2];
      }
      if(BEAN >= 92 * 48) {
        colors = colorsList[3];
      }
      if(BEAN >= 4488) {
        colors = colorsList[1];
      }
      if(BEAN >= 4488 + 8) {
        colors = colorsList[2];
      }
      if(BEAN >= 94 * 48) {
        colors = colorsList[3];
      }


      this.ctx.save();
      this.ctx.fillStyle = colors[0];
      this.ctx.scale(1 / cameraZoom, 1 / cameraZoom);
      this.ctx.fillRect(-80, -4.5, 160, 9);

      this.ctx.fillStyle = 'white';

      const amount = 16;
      for(let i = 0; i < amount; i++) {
        this.ctx.fillRect(((999999 + i - 0.5 - this.frame / 20) % amount) - amount / 2, -4.5, 0.1, 9);
      }
      this.ctx.restore();

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
        this.ctx.fillRect(-0.5, -0.5, 1, 1);
        this.ctx.restore();
        this.ctx.rotate(Math.PI / 4 + this.frame / 50);
        this.ctx.fillStyle = colors[1 + i];
        this.ctx.fillRect(-0.5, -0.5, 1, 1);
        this.ctx.restore();
      }



      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.yoyo = yoyo;
})(this);
