(function(global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

  class paint_n extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        },
        inputs: {
          ninetiesPatterns: new NIN.TextureInput()
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
      this.canvas.width = 9.423*GU;
      this.canvas.height = 9 * GU;
    }

    render() {

      // this.ctx.clearRect(0,0,16*GU,9*GU);
      // this.ctx.drawImage(this.inputs.ninetiesPatterns.getValue().image, 0, 0)
      // this.ctx.fillStyle = 'brown';
      // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      // this.ctx.save();
      // this.ctx.scale(GU, GU);

      // this.ctx.fillStyle = 'green';
      // let width = easeOut(0, 16, F(this.frame, 5184, 24));
      // width = easeOut(width, 0, F(this.frame, 5200, 12));
      // this.ctx.fillRect(0, 0, width, 9);

      // this.ctx.fillStyle = 'red';
      // this.ctx.rotate(45*Math.PI);
      // width = easeOut(0, 16, F(this.frame, 5300, 24));
      // width = easeOut(width, 0, F(this.frame, 5400, 12));
      // this.ctx.fillRect(0, 0, width, 9);









      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.paint_n = paint_n;
})(this);
