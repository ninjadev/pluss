(function(global) {
  class bgpants extends NIN.Node {
    constructor(id, options) {
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

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
      this.ctx.globalCompositeOperation = 'xor';
    }

    update(frame) {
      this.frame = frame;
    }

    renderShape(ctx, shape) {
      ctx.fill();
    }

    render(renderer) {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.clearRect(0, 0, 16 * GU, 9 * GU);

      var colors = ["#090918", "#cb7f68", "#ece9f5"];
      
      // Background
      this.ctx.fillStyle = colors[0];
      this.ctx.rect(-1 * GU , - 1 * GU, 18 * GU, 11 * GU);
      this.ctx.fill();

      var r3o2 = Math.sqrt(3) / 2;

      var orange_height = 0.30 * GU;
      var orange_width = orange_height / (Math.sqrt(3) / 2);
      var white_height = 0.2 * GU;
      var white_width = white_height / r3o2;

      for (var i = 0; i < 32; i++)
      {
        for (var j = 0; j < 14; j++)
        {

          var pos_x = i * GU * 0.5625;
          var pos_y = j * GU + GU * ((this.frame % 40) / 40) - 4 * GU;
          if ((i + j) % 2 == 0)
          {
            // Orange triangle
            this.ctx.fillStyle = colors[1];
            this.ctx.moveTo(pos_x, pos_y);
            this.ctx.beginPath();
            this.ctx.lineTo(pos_x + (orange_width), pos_y - orange_height * 2);
            this.ctx.lineTo(pos_x - (orange_width), pos_y - orange_height * 2);
            this.ctx.lineTo(pos_x, pos_y);
            this.ctx.stroke();
            this.ctx.fill();
            
          }
          else
          {
            // White triangle
            this.ctx.fillStyle = colors[2];
            this.ctx.moveTo(pos_x, pos_y - white_height);
            this.ctx.beginPath();
            this.ctx.lineTo(pos_x + white_width / 2, pos_y);
            this.ctx.lineTo(pos_x - white_width / 2, pos_y);
            this.ctx.lineTo(pos_x, pos_y - white_height);
            this.ctx.stroke();
            this.ctx.fill();
          }
        }
      }

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.bgpants = bgpants;
})(this);