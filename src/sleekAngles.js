(function(global) {
  class sleekAngles extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.random = new global.Random(44);

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.ps = new global.ParticleSystem({friction: 0.982, numParticles: 128});
      this.plusParticleSystem = new global.ParticleSystem(
        {
          friction: 1,
          numParticles: 4,
          life: 24,
          colors: ['#40C6D9']
        }
      );
      this.plusParticleSystem.shapeFunctions = [this.plusParticleSystem.renderPlus];

      this.frame = 0;
    }

    update(frame) {
      super.update(frame);
      this.ps.update();

      this.spawnPluses(this.frame);
      this.plusParticleSystem.update();
      /*
      if (BEAT && BEAN % 24 === 0) {
        for (let i = 0; i < 2; i++) {
          this.ps.spawn(8, 4.5);
        }
      }
      */
      this.frame = frame;
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      const yellow = '#FEE749';
      const pink = '#E55FA4';

      this.ctx.fillStyle = yellow;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.strokeStyle = pink;
      this.ctx.lineWidth = 0.025;
      this.ctx.fillStyle = pink;

      this.renderTriangles(this.frame);

      this.ps.render(this.ctx);
      this.plusParticleSystem.render(this.ctx);

      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    renderTriangles(frame) {
      const startFrame = FRAME_FOR_BEAN(864);
      const squeeze1Frame = FRAME_FOR_BEAN(888);
      const squeeze2Frame = FRAME_FOR_BEAN(900);
      const spinStartFrame = FRAME_FOR_BEAN(906);
      const spinEndFrame = FRAME_FOR_BEAN(932);
      const shrinkStartFrame = FRAME_FOR_BEAN(936);
      const shrinkEndFrame = FRAME_FOR_BEAN(960);

      const throb = Math.sin(2 * 2 * Math.PI * (frame - startFrame) / (FRAME_FOR_BEAN(912) - startFrame));

      const popupProgress = (frame - startFrame) / (squeeze1Frame - startFrame);
      let diamondSizeFactor = (
        2.75 * elasticOut(0, 1, 1.2, popupProgress) +
        0.1 * throb * lerp(0, 1, (frame - squeeze1Frame) / (squeeze2Frame - squeeze1Frame))
      );

      const spinProgress = (frame - spinStartFrame) / (spinEndFrame - spinStartFrame);
      let rotation = smoothstep(0, 1.5 * Math.PI, spinProgress);

      const shrinkProgress = (frame - shrinkStartFrame) / (shrinkEndFrame - shrinkStartFrame);

      const stopScalerFactor = lerp(1, 0, shrinkProgress);
      let horizontalScaler = 1 + stopScalerFactor * 0.06 * throb;
      let verticalScaler = 1 - stopScalerFactor * 0.1 * throb;

      // Popup particles
      if (popupProgress >= 0 && popupProgress < 0.33) {
        const particleIntensity = Math.max(0, Math.sin(lerp(0.2, 1, popupProgress) * Math.PI));
        for (let i = 0; i < 2; i++) {
          if (this.random() < particleIntensity) {
            const angle = this.random() * Math.PI * 2;
            const radius = Math.max(3, 0.9 + 2.7 * this.random());
            this.ps.spawn(
              8 + Math.cos(angle) * radius,  // x
              4.5 + Math.sin(angle) * radius,  // y
              (0.3 + 0.7 * particleIntensity) * 0.2 * Math.cos(angle),  // dx
              (0.3 + 0.7 * particleIntensity) * 0.2 * Math.sin(angle),  // dy
              angle,  // rotation
              particleIntensity * lerp(-0.1, 0.1, this.random()),  // rotationalSpeed
              lerp(0.3, 0.6, this.random())  // size
            );
          }
        }
      }

      // Rotation particles
      if (spinProgress >= 0 && spinProgress < 1) {
        const particleIntensity = Math.max(0, Math.sin(lerp(0.2, 1, spinProgress) * Math.PI) - 0.35);
        for (let i = 0; i < 1; i++) {
          if (this.random() < particleIntensity) {
            const angle = this.random() * Math.PI * 2;
            const radius = Math.max(3, 0.9 + 2.7 * this.random());
            this.ps.spawn(
              8 + Math.cos(angle) * radius,  // x
              4.5 + Math.sin(angle) * radius,  // y
              (0.3 + 0.7 * particleIntensity) * 0.2 * Math.cos(angle + Math.PI / 2),  // dx
              (0.3 + 0.7 * particleIntensity) * 0.2 * Math.sin(angle + Math.PI / 2),  // dy
              angle,  // rotation
              particleIntensity * lerp(0.08, 0.25, this.random()),  // rotationalSpeed
              lerp(0.3, 0.6, this.random())  // size
            );
          }
        }
      }

      let diamondPoints = [];
      for (let i = 0; i < 4; i++) {
        const angle = (i * 2 * Math.PI / 4 + rotation) % (Math.PI * 2);
        diamondPoints.push(
          {
            x: 8 + horizontalScaler * diamondSizeFactor * Math.cos(angle),
            y: 4.5 + verticalScaler * diamondSizeFactor * Math.sin(angle),
            angle: angle,
          }
        );
      }
      diamondPoints.sort(function(a, b) {
        return a.angle - b.angle;
      });
      let uppermostPoint = diamondPoints[0];
      let uppermostPointIndex = 0;
      for (let i = 0; i < diamondPoints.length; i++) {
        if (diamondPoints[i].y < uppermostPoint.y) {
          uppermostPoint = diamondPoints[i];
          uppermostPointIndex = i
        }
      }
      let orderedDiamondPoints = [];
      for (let i = 0; i < diamondPoints.length; i++) {
        orderedDiamondPoints.push(diamondPoints[(uppermostPointIndex + i) % diamondPoints.length])
      }
      const rightmostPoint = orderedDiamondPoints[1];
      const lowermostPoint = orderedDiamondPoints[2];
      const leftmostPoint = orderedDiamondPoints[3];

      let polygons;
      if (shrinkProgress < 1) {
        polygons = [
          [ // top left
            {x: lerp(0, leftmostPoint.x, shrinkProgress), y: lerp(0, uppermostPoint.y, shrinkProgress)},
            {x: uppermostPoint.x, y: lerp(0, uppermostPoint.y, shrinkProgress)},
            uppermostPoint,
            leftmostPoint,
            {x: lerp(0, leftmostPoint.x, shrinkProgress), y: leftmostPoint.y},
          ],
          [ // top right
            {x: lerp(16, rightmostPoint.x, shrinkProgress), y: lerp(0, uppermostPoint.y, shrinkProgress)},
            {x: lerp(16, rightmostPoint.x, shrinkProgress), y: rightmostPoint.y},
            rightmostPoint,
            uppermostPoint,
            {x: uppermostPoint.x, y: lerp(0, uppermostPoint.y, shrinkProgress)},
          ],
          [ // bottom right
            {x: lerp(16, rightmostPoint.x, shrinkProgress), y: lerp(9, lowermostPoint.y, shrinkProgress)},
            {x: lowermostPoint.x, y: lerp(9, lowermostPoint.y, shrinkProgress)},
            lowermostPoint,
            rightmostPoint,
            {x: lerp(16, rightmostPoint.x, shrinkProgress), y: rightmostPoint.y},
          ],
          [ // bottom left
            {x: lerp(0, leftmostPoint.x, shrinkProgress), y: lerp(9, lowermostPoint.y, shrinkProgress)},
            {x: lerp(0, leftmostPoint.x, shrinkProgress), y: leftmostPoint.y},
            leftmostPoint,
            lowermostPoint,
            {x: lowermostPoint.x, y: lerp(9, lowermostPoint.y, shrinkProgress)},
          ],
        ];
      } else {
        polygons = [];
        diamondSizeFactor *= Math.sqrt(2) / 2;

        const triangleRotationProgress = (frame - FRAME_FOR_BEAN(982)) / (FRAME_FOR_BEAN(994) - FRAME_FOR_BEAN(982));
        const triangleRotationOffset = smoothstep(0, Math.PI / 2, triangleRotationProgress);

        for (let i = 0; i < 4; i++) {
          const outProgress1 = (frame - FRAME_FOR_BEAN(958)) / (FRAME_FOR_BEAN(976) - FRAME_FOR_BEAN(958));
          const outProgress2 = (frame - FRAME_FOR_BEAN(996 + 3 * i)) / (FRAME_FOR_BEAN(1008 + 3 * i) - FRAME_FOR_BEAN(998 + 3 * i));
          const outFactor = Math.max(
            0,
            Math.sin(lerp(0, 1, outProgress1) * Math.PI),
            Math.sin(lerp(0, 1, outProgress2) * Math.PI)
          );

          const angle = i * 2 * Math.PI / 4 + Math.PI / 4 - triangleRotationOffset - smoothstep(0, Math.PI / 4, outProgress2);

          let offsetX = 8 + diamondSizeFactor * Math.cos(angle) +
             1.5 * outFactor * Math.cos(angle);
          let offsetY = 4.5 + diamondSizeFactor * Math.sin(angle) +
             1.5 * outFactor * Math.sin(angle);

          const polygon = [{x: offsetX, y: offsetY}];
          for (let j = 0; j < 3; j++) {
            polygon.push(
              {
                x: offsetX + diamondSizeFactor * Math.cos(j * 2 * Math.PI / 4 - Math.PI / 2 + angle),
                y: offsetY + diamondSizeFactor * Math.sin(j * 2 * Math.PI / 4 - Math.PI / 2 + angle),
              }
            );
          }
          polygons.push(polygon)
        }
      }

      for (let polygon of polygons) {
        this.ctx.beginPath();
        this.ctx.moveTo(polygon[0].x, polygon[0].y);
        for (let i = 1; i < polygon.length; i++) {
          this.ctx.lineTo(polygon[i].x, polygon[i].y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      }
    }

    spawnPluses(frame) {
      if (BEAT) {
        if (BEAN === 1028) {
          this.plusParticleSystem.spawn(
            2,  // x
            2,  // y
            0,  // dx
            0,  // dy
            0,  // rotation
            0.0666,  // rotationalSpeed
            1.4  // size
          );
          for (let i = 0; i < 2; i++) {
            this.ps.spawn(2, 2);
          }
        } else if (BEAN === 1040) {
          this.plusParticleSystem.spawn(
            14,  // x
            2,  // y
            0,  // dx
            0,  // dy
            0,  // rotation
            0.0666,  // rotationalSpeed
            1.4  // size
          );
          for (let i = 0; i < 2; i++) {
            this.ps.spawn(14, 2);
          }
        } else if (BEAN === 1044) {
          this.plusParticleSystem.spawn(
            2,  // x
            7,  // y
            0,  // dx
            0,  // dy
            0,  // rotation
            0.0666,  // rotationalSpeed
            1.4  // size
          );
          for (let i = 0; i < 2; i++) {
            this.ps.spawn(2, 7);
          }
        } else if (BEAN === 1052) {
          this.plusParticleSystem.spawn(
            14,  // x
            7,  // y
            0,  // dx
            0,  // dy
            0,  // rotation
            0.0666,  // rotationalSpeed
            1.4  // size
          );
          for (let i = 0; i < 2; i++) {
            this.ps.spawn(14, 7);
          }
        }
      }
    }
  }

  global.sleekAngles = sleekAngles;
})(this);
