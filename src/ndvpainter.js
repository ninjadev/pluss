(function(global) {
  class ndvpainter extends NIN.THREENode {constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        },
        inputs: {
          squigglesBG: new NIN.TextureInput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.n_shape = new Path2D("M 0 0 h 390 l 267 309 v -309 h 390 v 886 h -390 l -270 -316 v 316 h -390 z");
      this.n_3d = new Path2D("M 390 0 l 100 25 L 652 215 v 94 L 390 -0 M 1048 0 l 81 52 v 779 l -81 52 L 1048 0 M 390 886 l 81 -52 v -158 L 389 573 L 390 886")

      this.dv = new Path2D("M1352 148q0-19-19-31a77 77 0 0 0-42-13q-41 0-88 66h-3q-27 35-76 106-39 68-121 203-10 20-17 20-25 0-27-57 2 44 2-74 0-42-39-42-59 0-59 88 0 8 15 45l19 51 25 119q24 82 66 82 35 0 59-79l34-111q28-49 85-134 67-102 91-121 59-47 65-54 30-30 30-64zM854 646q-8-51-12-60V305a152 152 0 0 1 1-23l1-14v-29-2l-7-35-17-16-26-6c-13-4-22-6-29-6q-23 0-23 73a7 7 0 0 1 0 2l5 32 8 24c1 6 6 13 6 20 4 9 5 21 5 37l-1 45a46 46 0 0 0-13 4c-55 27-102 66-140 114-36 46-72 98-63 160 10 58 57 90 112 97 46 5 101 2 137-29a24 24 0 0 0 12 3q53 1 53-42 0-16-9-68zm-105 36c-17 21-53 20-79 17-34-4-46-27-33-59 21-56 70-104 122-136a497 497 0 0 0 4 168 41 41 0 0 0-14 10z");
    }

    update(frame) {
      super.update(frame);

      let scale = 0.00000;
      let x = 0;
      let y = 0;

      const currentBean = BEAN_FOR_FRAME(frame);
      if (currentBean < 5166) {
        scale = 0.0010;
        x = 14300;
        y = 500;
      } else if (currentBean < 5172) {
        scale = 0.0025;
        x = 4900;
        y = 220;
      } else if (currentBean < 5178) {
        scale = 0.0055;
        x = 1490;
        y = 97;
      } else if (currentBean < 5184) {
        // scale = 0.0075;
        // x = 480;
        // y = 64;
        scale = 0.0070;
        x = 870;
        y = 96;
      } else {
        // scale = 0.0085;
        // x = 300;
        // y = 86;
        scale = 0.0085;
        x = 300;
        y = 64;
      }

      this.scale = scale;
      this.x = x  ;
      this.y = y;
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width ,this.canvas.height);

      this.ctx.save();
      // this.ctx.drawImage(this.squigglesBG.getValue().image, 0, 0);
      this.ctx.scale(GU, GU);

      this.ctx.fillStyle = 'rgba(0,0,0,0.0)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(this.scale, this.scale);
      this.ctx.translate(this.x, this.y)
      this.ctx.lineWidth = 10;
      this.ctx.lineJoin = "round";
      this.ctx.lineCap = "round";

      this.ctx.fillStyle = 'rgba(0,0,0,0.25)';
      this.ctx.fill(this.n_shape);
      this.ctx.stroke(this.n_shape);

      this.ctx.fillStyle = '#888';
      this.ctx.fill(this.n_3d);
      this.ctx.stroke(this.n_3d);
      this.ctx.fillStyle = '#fff'
      this.ctx.fill(this.dv);
      this.ctx.stroke(this.dv);
      this.ctx.restore();

      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.ndvpainter = ndvpainter;
})(this);
