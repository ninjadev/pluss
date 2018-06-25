(function(global) {
  class sleekAngles extends NIN.THREENode {
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
      this.ctx.fillStyle = '#ff3eb5';

      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(5, 5);
      this.ctx.lineTo(0, 5);
      this.ctx.fill();

      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.sleekAngles = sleekAngles;
})(this);
