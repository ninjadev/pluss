(function(global) {
  class ninjadevtext extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');

      const gradientResolution = 16;
      const gradient = this.ctx.createLinearGradient(0, 0, gradientResolution, 0);
      gradient.addColorStop(0, '#d46ce7');
      gradient.addColorStop(1, '#e9f259');
      this.canvas.width = gradientResolution;
      this.canvas.height = 1;
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, gradientResolution, 1);
      const data = this.ctx.getImageData(0, 0, gradientResolution, 1).data;
      this.gradient = [];
      function hex(num) {
        return ('0' + num.toString(16)).slice(-2);

      }
      for(let i = 0; i < gradientResolution; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        this.gradient.push('#' + hex(r) + hex(g) + hex(b));
        this.gradient.unshift('#' + hex(r) + hex(g) + hex(b));
      }

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
      this.ctx.fillStyle = '#7cf3d3';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = 'bold 3px Arial';
      this.ctx.fillStyle = 'white';
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 0.05;
      this.ctx.translate(8, 4.5);
      const offset = -1 / 5;
      const rounds = 30;
      const rotation = Math.sin(this.frame / 60 / 60 * 190 * Math.PI / 2) / 4;
      this.ctx.translate(-rounds * offset, -rounds * offset);
      for(let i = rounds; i >= 0; i--) {
        this.ctx.translate(offset, offset);
        this.ctx.rotate(-rotation);
        this.ctx.fillStyle = this.gradient[((999999 * this.gradient.length + i - this.frame) | 0) % this.gradient.length];
        this.ctx.fillText('Ninjadev', 0 , 0);
        this.ctx.strokeText('Ninjadev', 0 , 0);
        this.ctx.rotate(rotation);
      }

      this.ctx.restore();



      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.ninjadevtext = ninjadevtext;
})(this);
