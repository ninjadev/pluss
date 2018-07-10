(function(global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

  class spinningCube extends NIN.THREENode {
    constructor(id) {
      super(id, {
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



      this.path1 = new Path2D("M1531 106 h -1 v -2 l -81 -52 -1 1 v -1 l -387 1 v 2 h -2 l 1 199 L 903 91 l -1 1 v -1 L 792 51 v 1 l -388 1 v 1 h -1 l -1 889 h 3 l 1 -887 386 -1 268 309 1 -1 h 2 l -1 -307 385 -1 -1 885 h -383 L 796 622 l -2 1 h -1 l -3 317 -384 1 v 3 l 388 -1 v -2 l 79 -49 -1 -1 h 2 V 720 l 187 222 h 1 v 1 h 386 v -1 h 1 l 1 -886 78 50 v 787 l -79 49 1 3 80 -50 -1 -2 h 2 z M 872 717 v 172 h -1 l -78 49 3 -311 76 90 z m 188 -458 v 100 L 797 56 l 104 38 z");

      this.path2 = new Path2D("M1754 201q0-19-19-31a77 77 0 0 0-42-12q-41 0-88 65h-3q-27 35-76 106-39 68-121 203-10 20-17 20-25 0-27-57 2 44 2-74 0-42-39-42-59 0-59 88 0 8 15 45l19 51 25 119q24 82 66 82 35 0 59-79l34-111q28-49 85-134 67-102 91-121 59-47 65-54 30-30 30-64zM1256 699q-8-51-12-60V358a152 152 0 0 1 1-23l1-14v-29-2l-7-35-17-16-26-6c-13-4-22-6-29-6q-23 0-23 73a7 7 0 0 1 0 2l5 32 8 24c1 6 6 13 6 20 4 9 5 21 5 37l-1 45a46 46 0 0 0-13 4c-55 27-102 66-140 114-36 46-72 98-63 160 10 58 57 90 112 97 46 5 101 2 137-29a24 24 0 0 0 12 4q53 0 53-43 0-16-9-68zm-105 36c-18 21-53 20-79 17-34-4-46-27-34-59 22-56 71-104 123-136a497 497 0 0 0 4 168 41 41 0 0 0-14 10z");
    




    }

    update(frame) {
      super.update(frame);

    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      this.ctx.save();
      this.ctx.scale(GU,GU);
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 2;
      this.ctx.save();
      this.ctx.scale(0.009,0.009);

      this.ctx.save();
      this.ctx.fillStyle = "black";
      this.ctx.fill(this.path1);
      this.ctx.restore();

      this.ctx.save();
      this.ctx.fillStyle = "white";
      this.ctx.fill(this.path2);
      this.ctx.restore();

      this.ctx.restore();
      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.spinningCube = spinningCube;
})(this);
