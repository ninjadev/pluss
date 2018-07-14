(function(global) {
  class paint_n_3d extends NIN.THREENode {
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


    warmup(renderer) {
      this.ctx.update(8226);
      this.ctx.render(renderer);
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

      this.ctx.fillStyle = 'yellow';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.paint_n_3d = paint_n_3d;
})(this);
