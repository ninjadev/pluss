(function(global) {
  class sleekAngles extends NIN.THREENode {
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

      this.frame = 0;
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
      this.ctx.fillStyle = '#FEE749';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.fillStyle = '#E55FA4';
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 0.1;

      this.renderTriangles(this.frame);
      this.renderPluses(this.frame);

      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    renderTriangles(frame) {
      const startFrame = FRAME_FOR_BEAN(864);
      const endFrame = FRAME_FOR_BEAN(912);
      const progress = (frame - startFrame) / (endFrame - startFrame);

      const throb = Math.sin(2 * Math.PI * progress * 2);

      const sizeFactor = 2.75 + 0.1 * throb;

      for (let i = 0; i < 4; i++) {
        this.ctx.beginPath();
        let offsetX = 8 + sizeFactor * Math.cos(i * 2 * Math.PI / 4 + Math.PI / 4);
        let offsetY = 4.5 + sizeFactor * Math.sin(i * 2 * Math.PI / 4 + Math.PI / 4);
        this.ctx.moveTo(offsetX, offsetY);
        for (let j = 0; j < 3; j++) {
          this.ctx.lineTo(
            offsetX + sizeFactor * Math.cos(j * 2 * Math.PI / 4 - Math.PI / 4 + i * Math.PI / 2),
            offsetY + sizeFactor * Math.sin(j * 2 * Math.PI / 4 - Math.PI / 4 + i * Math.PI / 2)
          );
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      }
    }

    renderPluses(frame) {
      this.ctx.fillStyle = '#1C999D';

      const thickness = 0.12;
      const diameter = thickness * 4;
      for (let i = 0; i < 4; i++) {
        this.ctx.save();
        this.ctx.translate(
          8 + 9 * Math.cos(i * 2 * Math.PI / 4 + Math.PI / 4),
          4.5 + 4.5 * Math.cos(i * Math.PI + Math.PI / 4)
        );
        this.ctx.rotate(i + 4 * frame / 60);
        this.ctx.fillRect(-diameter / 2, -thickness / 2, diameter, thickness);
        this.ctx.fillRect(-thickness / 2, -diameter / 2, thickness, diameter);
        this.ctx.restore();
      }
    }
  }

  global.sleekAngles = sleekAngles;
})(this);