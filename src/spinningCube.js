(function(global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

  class spinningCube extends NIN.THREENode {
    constructor(id, options) {

      super(id, {
        inputs: {
          squiggles: new NIN.TextureInput(),
          bananas: new NIN.TextureInput(),
          paint_n: new NIN.TextureInput(),
          paint_dv: new NIN.TextureInput(),
          paint_n_3d: new NIN.TextureInput()
        },
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5),
                                 new THREE.MeshBasicMaterial({ color: 0x000fff }));
      this.scene.add(this.cube);
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

    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      if(this.inputs.paint_n.getValue()) {
        this.n_fill = this.inputs.paint_n.getValue().image;
      }
      if(this.inputs.paint_n_3d.getValue()) {
        this.n_3d_fill = this.inputs.paint_n_3d.getValue().image;
      }
      if(this.inputs.paint_dv.getValue()) {
        this.dv_fill = this.inputs.paint_dv.getValue().image;
      }
      if(this.inputs.squiggles.getValue()) {
        this.background_fill = this.inputs.squiggles.getValue().image;
      }


      // clear it
      this.ctx.clearRect(0,0,16*GU,9*GU);

      // background
      if(this.background_fill) {
        this.ctx.drawImage(this.background_fill, 0, 0);
      }
      this.ctx.save();
      this.ctx.translate(160,20);
      this.ctx.scale(GU,GU);
      this.ctx.save();
      this.ctx.scale(0.009,0.009);

      // draw the n
      this.ctx.save();

      this.ctx.lineWidth = 10;
      this.ctx.lineJoin = "round";
      this.ctx.lineCap = "round";
      this.ctx.stroke(this.n_shape);
      this.ctx.clip(this.n_shape, "evenodd");
      this.ctx.scale(2.79,10);
      if(this.n_fill) {
        this.ctx.drawImage(this.n_fill, 0, 0);
      }
      this.ctx.restore();

      // draw 3d effects of n

      this.ctx.save();
      this.ctx.lineWidth = 10
      this.ctx.lineJoin = "round";
      this.ctx.lineCap = "round";
      this.ctx.stroke(this.n_3d);
      this.ctx.clip(this.n_3d, "evenodd");
      this.ctx.scale(10,10);
      if(this.n_3d_fill) {
        this.ctx.drawImage(this.n_3d_fill, 0, 0);
      }
      this.ctx.restore();

      // paint dv
      this.ctx.save();
      this.ctx.lineWidth = 10;
      this.ctx.stroke(this.dv);
      this.ctx.clip(this.dv, "evenodd");
      this.ctx.scale(10,10);
      if(this.dv_fill) {
        this.ctx.drawImage(this.dv_fill, 0, 0);
      }
      this.ctx.restore();

      this.ctx.restore();
      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    warmup(renderer) {
      this.update(8325);
      this.render(renderer);
    }
  }

  global.spinningCube = spinningCube;
})(this);
