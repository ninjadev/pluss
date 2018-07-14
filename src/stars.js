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

      this.blue = "#64bac8";
      this.pink = "#d1679e";
      this.green = "#74fbc9";
      this.yellow = "#fae767";

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
      let startBEAN = 3984;
      let takt = 96;
      
      let colors = [this.pink, this.blue, this.green];
      let bgcolor = this.yellow;
      if (BEAN > startBEAN + takt) {
        colors = [this.yellow, this.pink, this.blue];
        bgcolor = this.green;
      }
      if (BEAN > startBEAN + takt * 2) {
        colors = [this.green, this.yellow, this.pink];
        bgcolor = this.blue;
      }
      if (BEAN > startBEAN + takt * 3) {
        colors = [this.blue, this.green, this.yellow];
        bgcolor = this.pink;
      }

      let amp = 0.01;
      if(BEAT && BEAN <= 4272) {
        let b = (BEAN - 3984) % (48 * 4);
        if ((b >= 32 - 4 && b < 32) || 
          (b >= 48 - 4 && b < 48) ||
          (b >= 48 + 32 - 4 && b < 48 + 32) ||
          (b >= 48 + 48 - 4 && b < 48 + 48) || 
          (b >= 48 + 48 + 12 && b < 48 + 48 + 16) || 
          (b >= 48 + 48 + 12 + 8  && b < 48 + 48 + 12 + 12) || 
          (b >= 48 + 48 + 32 - 4  && b < 48 + 48 + 32) || 
          (b >= 48 + 48 + 48 - 4  && b < 48 + 48 + 48) || 
          (b >= 48 * 3 && b < 48 * 3 + 4) ||
          (b >= 48 * 3 + 8 && b < 48 * 3 + 12) || 
          (b >= 48 * 3 + 24 - 4 && b < 48 * 3 + 24) || 
          (b >= 48 * 3 + 32 - 4 && b < 48 * 3 + 32) || 
          (b >= 48 * 3 + 32 && b < 48 * 3 + 32 + 4)) {amp = 0.13}
      }

      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.fillStyle = bgcolor;
      this.ctx.fillRect(0, 0, 16, 9);
      for (var i=0;i<200;i++) {
        var x = this.stars[i][0] + amp*Math.sin(i + frame/60);
        var y = this.stars[i][1] + amp*Math.cos(i + frame/60);
        var r = this.stars[i][2] + amp*0.3;
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
        this.ctx.fillStyle = colors[i%colors.length];
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
