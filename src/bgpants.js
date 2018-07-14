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
      if(BEAN >= 4464) {
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
      } else {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.clearRect(0, 0, 16 * GU, 9 * GU);

        var colors = ["#090918", "#cb7f68", "#ece9f5"];

        // Background
        this.ctx.fillStyle = colors[0];
        this.ctx.rect(-1 * GU , - 1 * GU, 18 * GU, 11 * GU);
        this.ctx.fill();

        var r3o2 = Math.sqrt(3) / 2;

        var orange_height_normal = 0.30 * GU;
        var orange_height = orange_height_normal;
        var white_height_normal = 0.2 * GU;
        var white_height = white_height_normal;

        var orange_width = orange_height / (Math.sqrt(3) / 2);
        var white_width = white_height / r3o2;
        for (var i = 0; i < 32; i++)
        {
          for (var j = 0; j < 14; j++)
          {
            var pos_x = i * GU * 0.5 / r3o2;
            var pos_y = j * GU + GU * ((this.frame % 60) / 30) - 4 * GU;

            // Zoom
            pos_x -= (8 - pos_x / GU) * 0.4 * GU * smoothstep(1, 0, ((BEAN - 12 * 4 * 91.75) / (12 * 4 * (92 - 91.75 ))));
            pos_y -= (4.5 - pos_y / GU) * 0.4 * GU * smoothstep(1, 0, ((BEAN - 12 * 4 * 91.75) / (12 * 4 * (92 - 91.75 ))));

            // Grow and define size
            var dist_center = Math.sqrt(Math.pow(4.5 - pos_y / GU,2) + Math.pow(8 - pos_x / GU ,2));
            var orange_height = smoothstep(0, orange_height_normal, ((BEAN - 12 * 4 * 91) / (12 * 4 * (91.10 - 91 ))) - (dist_center/4));
            var white_height = smoothstep(0, white_height_normal, ((BEAN - 12 * 4 * 91.25) / (12 * 4 * (91.35 - 91.25 ))) - (dist_center/4));
            // Puls in and out at start of scene. Scene starts properly at bridge 3 that is at BEAN #4368
            // starts at about 4320
            var startBean = 4320;
            var endBean = 4368;
            if(startBean < BEAN && BEAN < endBean)
            {
              let beanInterval = endBean - startBean;
              let howFarWeAreAlong = BEAN - startBean;
              let fractionIn = howFarWeAreAlong / beanInterval;
              orange_height = Math.sin(fractionIn * Math.PI) * orange_height_normal;
              white_height = Math.sin(fractionIn * Math.PI) * white_height_normal;
            }
            var orange_width = orange_height / (Math.sqrt(3) / 2);
            var white_width = white_height / r3o2;

            // Drop down a bit starting from the center
            pos_y += GU * smoothstep(0, 1, ((BEAN - 12 * 4 * 92) / (12 * 4 * (92.20 - 92 ))) - (dist_center/7));


            //pos_y += white_height * 10;

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
      }

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.bgpants = bgpants;
})(this);
