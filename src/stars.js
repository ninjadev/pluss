(function(global) {
  class sky extends NIN.THREENode {
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

      this.colors = ["#d1679e", "#64bac8", "#fae767"];

      this.stars = [];
      for (var i=0;i<200;i++) {
        var x = Math.random() * 16;
        var y = Math.random() * 9;
        var r = (Math.random() * 9 + 1) * 0.02;
        this.stars.push([x, y, r]);
      }
    }

    update(frame) {
      super.update(frame);
      this.canvas.width += 0;

      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.fillStyle = "#42f4c5";
      this.ctx.fillRect(0, 0, 16, 9);
      let amp = frame%24 < 4 ? 0.06 : 0.01;
      for (var i=0;i<200;i++) {
        var x = this.stars[i][0] + amp*Math.sin(i + frame/60);
        var y = this.stars[i][1] + amp*Math.cos(i + frame/60);
        var r = this.stars[i][2];
        this.stars[i][0] = x;
        this.stars[i][1] = y;
        var a = x + r*0.5;
        var b = y + r*0.5;

        this.ctx.beginPath();
        this.ctx.arc(a, b, r*2, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#000000";
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x, y, r*2, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.colors[i%this.colors.length];
        this.ctx.fill();
      }

      this.ctx.restore();
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

  global.stars = sky;
})(this);
