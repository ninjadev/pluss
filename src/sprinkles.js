(function(global) {
  class sprinkles extends NIN.THREENode {
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

      // This clears the canvas
      this.canvas.width += 0;

      {
        const random = new Random("speed")
        const ctx = this.ctx;
        ctx.save();
        ctx.scale(GU, GU);

        // Fill transparent backgound for antialiasing purposes.
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0, 0, 16, 9);

        const nudge = () => random()*0.3;


        // Sprincle drawing
        const draw_sprinkle = () => {
          ctx.save();
          ctx.rotate(frame/100 % 2*Math.PI + random());
          ctx.translate(-0.5,-2);
          ctx.beginPath();
          ctx.lineTo(0+nudge(),0+nudge());
          ctx.lineTo(0+nudge(),4+nudge());
          ctx.lineTo(1+nudge(),4+random());
          ctx.lineTo(1+nudge(),0+nudge());
          ctx.closePath();
          ctx.lineWidth = 0.1;
          ctx.fillStyle = '#fdf143';
          ctx.strokeStyle = '#ff5';
          ctx.stroke();
          ctx.fill();
          ctx.restore();
        }
        ctx.scale(0.2, 0.2);
        ctx.translate(1,1);
        for (const x in [...Array(10).keys()]) {
          ctx.save();
          ctx.translate(random()*2,random()*2);
          for (const y in [...Array(10).keys()]) {
            ctx.save();
            ctx.translate(random()*4,random()*2);
            ctx.translate(x*8,y*4.3);
            draw_sprinkle();
            ctx.restore();
          }
          ctx.restore();
        }

        ctx.restore();
      }
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.sprinkles = sprinkles;
})(this);
