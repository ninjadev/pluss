(function(global) {
  class arctic extends NIN.THREENode {
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

      this.amplitude = 0;
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;

      this.amplitude *= 0.9;

      if(BEAT && BEAN <= 4272) {
        switch((BEAN - 3984) % (48 * 4)) {
        case 0:
        case 32 - 4:
        case 48 - 4:
        case 48 + 32 - 4:
        case 48 + 48 - 4:
        case 48 + 48 + 12:
        case 48 + 48 + 12 + 8:
        case 48 + 48 + 32 - 4:
        case 48 + 48 + 48 - 4:
        case 48 * 3:
        case 48 * 3 + 8:
        case 48 * 3 + 24 - 4:
        case 48 * 3 + 32 - 4:
        case 48 * 3 + 32:
          this.amplitude = 1;
        }
      }
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      // This clears the canvas
      this.canvas.width += 0;

      this.ctx.save();
      this.ctx.scale(GU, GU);

      // Shadow
      this.ctx.strokeStyle = '#090918';

      this.ctx.translate(0, 4.5);

      let startBEAN = 4296;
      let sluttBEAN = 4319;
      let t = (this.frame - FRAME_FOR_BEAN(startBEAN))/(FRAME_FOR_BEAN(sluttBEAN) - FRAME_FOR_BEAN(startBEAN));
      let c = lerp(255, 0, t);
      let width = lerp(0.1, 10, t);

      const count = 128;
      this.ctx.beginPath();
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'butt';
      this.ctx.lineWidth = 0.1;
      this.ctx.moveTo(-1, 0);
      const amplitude = 2 * this.amplitude;
      for(let i = 0; i < count; i++) {
        const x = (i + 1) / count * 16;
        const y = amplitude * Math.sin(i / count * 32 + this.frame / 2) *
          smoothstep(0, 1, 2 * i / count) *
          smoothstep(1, 0, 2 * i / count - 1);
        this.ctx.lineTo(x, y + 0.05);
      }
      this.ctx.stroke();

      this.ctx.strokeStyle = `rgb(${c},${c},${c})`;

      this.ctx.beginPath();
      this.ctx.lineJoin = 'round';
      this.ctx.lineWidth = width;;
      this.ctx.moveTo(0, 0);
      for(let i = 0; i < count; i++) {
        const x = (i + 1) / count * 16;
        const y = amplitude * Math.sin(i / count * 32 + this.frame / 2) *
          smoothstep(0, 1, 2 * i / count) *
          smoothstep(1, 0, 2 * i / count - 1);
        this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();

      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.arctic = arctic;
})(this);
