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
      const color = '#1C999D';
      const radius = 0.24;

      for (let i = 0; i < 4; i++) {
        const x = 8 + 9 * Math.cos(i * 2 * Math.PI / 4 + Math.PI / 4);
        const y = 4.5 + 4.5 * Math.cos(i * Math.PI + Math.PI / 4);
        const rotation = i + 4 * frame / 60;
        this.renderPlus(x, y, radius, rotation, color);
      }
    }

    renderWideRectangle(x, y, radius, rotation, color) {
      const thickness = radius / 3;
      const diameter = radius * 3;

      this.ctx.save();
      this.ctx.fillStyle = color;
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);
      this.ctx.fillRect(-diameter / 2, -thickness / 2, diameter, thickness);
      this.ctx.restore();
    }

    renderPlus(x, y, radius, rotation, color) {
      const thickness = radius / 2;
      const diameter = radius * 2;

      this.ctx.save();
      this.ctx.fillStyle = color;
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);
      this.ctx.fillRect(-diameter / 2, -thickness / 2, diameter, thickness);
      this.ctx.fillRect(-thickness / 2, -diameter / 2, thickness, diameter);
      this.ctx.restore();
    }

    renderPolygon(x, y, radius, rotation, color, numPoints) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);
      this.ctx.fillStyle = color;

      this.ctx.beginPath();
      this.ctx.moveTo(
        radius * Math.cos(0),
        radius * Math.sin(0)
      );
      for (let j = 0; j < numPoints; j++) {
        this.ctx.lineTo(
          radius * Math.cos(j * 2 * Math.PI / numPoints),
          radius * Math.sin(j * 2 * Math.PI / numPoints)
        );
      }
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.restore();
    }

    renderTriangle(x, y, radius, rotation, color) {
      return this.renderPolygon(x, y, radius, rotation, color, 3);
    }

    renderHexagon(x, y, radius, rotation, color) {
      return this.renderPolygon(x, y, radius, rotation, color, 6);
    }

    renderSquare(x, y, radius, rotation, color) {
      return this.renderPolygon(x, y, radius, rotation, color, 4);
    }

    renderStar(x, y, radius, rotation, color, numPoints=5, insetFactor=0.5) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.beginPath();
      this.ctx.rotate(rotation);
      this.ctx.fillStyle = color;
      this.ctx.moveTo(0, 0 - radius);
      for (let i = 0; i < numPoints; i++) {
        this.ctx.rotate(Math.PI / numPoints);
        this.ctx.lineTo(0, 0 - (radius * insetFactor));
        this.ctx.rotate(Math.PI / numPoints);
        this.ctx.lineTo(0, 0 - radius);
      }
      this.ctx.fill();
      this.ctx.restore();
    }

    renderJaggedLine(x, y, radius, rotation, color, numPoints=8) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 0.12 * radius;

      this.ctx.moveTo(-2 * radius, 0);
      this.ctx.beginPath();
      for (let j = 0; j < numPoints; j++) {
        this.ctx.lineTo(
          -2 * radius + (j - (j % 2 === 1 ? 0.4 : 0)) * 4 * radius / numPoints,
          (0.12 + 0.04 * j) * (j % 2 === 0 ? -1 : 1)
        );
      }
      this.ctx.stroke();

      this.ctx.restore();
    }

    renderWavyLine(x, y, radius, rotation, color, numPoints=12) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 0.12 * radius;

      this.ctx.moveTo(-2 * radius, 0);
      this.ctx.beginPath();
      for (let j = 0; j < numPoints; j++) {
        this.ctx.lineTo(
          -2 * radius + j * 4 * radius / numPoints,
          0.08 * Math.sin(4 * Math.PI * j / numPoints)
        );
      }
      this.ctx.stroke();

      this.ctx.restore();
    }

    renderHalfFilledArc(x, y, radius, rotation, color) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius, 0, Math.PI);
      this.ctx.fill();
      this.ctx.restore();
    }

    renderHalfStrokedArc(x, y, radius, rotation, color) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);
      this.ctx.lineWidth = 0.24 * radius;
      this.ctx.strokeStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius, 0, Math.PI);
      this.ctx.stroke();
      this.ctx.restore();
    }

    renderQuarterFilledArc(x, y, radius, rotation, color) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, radius, 0, Math.PI / 2);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    }

    renderQuarterStrokedArc(x, y, radius, rotation, color) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);
      this.ctx.lineWidth = 0.24 * radius;
      this.ctx.strokeStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius, 0, Math.PI / 2);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  global.sleekAngles = sleekAngles;
})(this);
