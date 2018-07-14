(function(global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));
  class topRightNDVLogoNode extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });
      this.osd = document.createElement('img');
      Loader.load('res/bw.png', this.osd, () => {
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.n =new Path2D('M 0 0 h 390 l 267 309 v -309 h 390 v 886 h -390 l -270 -316 v 316 h -390 z');
      this.threedee = new Path2D('M 390 0 l 100 25 L 656 215 v 94 L 390 0 M 1047 0 l 81 52 v 782 l -81 52 L 1047 0 M 390 886 l 81 -52 v -163 L 389 573 L 390 886');
      this.dv = new Path2D('M1352 148q0-19-19-31a77 77 0 0 0-42-13q-41 0-88 66h-3q-27 35-76 106-39 68-121 203-10 20-17 20-25 0-27-57 2 44 2-74 0-42-39-42-59 0-59 88 0 8 15 45l19 51 25 119q24 82 66 82 35 0 59-79l34-111q28-49 85-134 67-102 91-121 59-47 65-54 30-30 30-64zM854 646q-8-51-12-60V305a152 152 0 0 1 1-23l1-14v-29-2l-7-35-17-16-26-6c-13-4-22-6-29-6q-23 0-23 73a7 7 0 0 1 0 2l5 32 8 24c1 6 6 13 6 20 4 9 5 21 5 37l-1 45a46 46 0 0 0-13 4c-55 27-102 66-140 114-36 46-72 98-63 160 10 58 57 90 112 97 46 5 101 2 137-29a24 24 0 0 0 12 3q53 1 53-42 0-16-9-68zm-105 36c-17 21-53 20-79 17-34-4-46-27-33-59 21-56 70-104 122-136a497 497 0 0 0 4 168 41 41 0 0 0-14 10z');
      this.r = new Path2D('M1510.82,961.79a29,29,0,0,0-20.71-8c-17,0-25.56,9.54-25.56,28.38a46.52,46.52,0,0,0,.38,6.07v.07s0,0,0,.06c1.86,13.79,10.3,20.77,25.17,20.77a30,30,0,0,0,20.33-7.62,24.7,24.7,0,0,0,8.77-19.35C1519.21,974,1516.38,967.11,1510.82,961.79ZM1470.5,973.2h0a2.76,2.76,0,0,1,.08-.27Zm21,30.19c-13.8,0-20.51-6.94-20.51-21.22,0-15.23,6.71-22.63,20.51-22.63,14.28,0,21.22,7.4,21.22,22.63C1512.75,996.45,1505.81,1003.39,1491.53,1003.39Zm13.51-27.6c0-4.22-2-9.25-11.38-9.25h-12.09v31.27h5.75V985.05h3.77l7.09,12.76h6.67L1497.74,985C1502.52,984.54,1505,981.38,1505,975.79ZM1493,979.3h-5.63v-7h7c3.77,0,4.21,1.59,4.21,2.79C1498.57,976.89,1498,979.3,1493,979.3Z');
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
      this.ctx.save();
      this.ctx.fillStyle = '#1ca05f';
      this.ctx.scale(GU, GU);
      this.ctx.clearRect(0, 0, GU, GU);
      this.ctx.translate(8, 4.5);

      const size = 1 / this.osd.width * 14;

      this.ctx.save();
      this.ctx.translate(-7, 0.5);
      this.ctx.scale(size, size);
      this.ctx.globalCompositeOperation = 'destination-in';
      this.ctx.restore();

      this.ctx.save();
      this.ctx.globalCompositeOperation = 'source-over';

      let alpha = lerp(0.0, 1.0, (this.frame - 623) / (696 - 653));
      alpha = lerp(alpha, 0.0, (this.frame - 8156 + 30) / 30);

      this.ctx.globalAlpha = alpha;

      const whiteParts = [[5682, 6290], [6820, 7046]];
      let mixer = 0.0;
      for (let [start, stop] of whiteParts) {
        mixer = lerp(mixer, 1.0, (this.frame + 15 - start) / 30);
        mixer = lerp(mixer, 0.0, (this.frame + 15 - stop) / 30);
      }
      const imix = 1.0 - mixer;

      const color = 255.0 * mixer;

      const fillStyle = `rgba(${color}, ${color}, ${color}, ${0.8 + mixer * 0.1})`;

      const scale = 0.0010;
      this.ctx.fillStyle = fillStyle;
      this.ctx.scale(scale, scale);
      this.ctx.translate(6300, -4000);
      this.ctx.lineWidth = 20;
      this.ctx.fill(this.n);
      this.ctx.stroke(this.threedee);
      this.ctx.stroke(this.n);

      let dvColor = 200 + 55 * imix;

      this.ctx.fillStyle = `rgba(${dvColor}, ${dvColor}, ${dvColor}, 0.9)`;
      this.ctx.fill(this.dv);
      this.ctx.stroke(this.dv);
      this.ctx.restore();

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.topRightNDVLogoNode = topRightNDVLogoNode;
})(this);
