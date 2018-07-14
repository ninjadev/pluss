(function(global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));
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

      this.ps = new global.ParticleSystem({friction: 0.982, numParticles: 128, life: 64});
      this.plusParticleSystem = new global.ParticleSystem(
        {
          friction: 1,
          numParticles: 4,
          life: 24,
          colors: ['#40C6D9']
        }
      );
      this.plusParticleSystem.shapeFunctions = [this.plusParticleSystem.renderPlus];

      this.pink = '#E55FA4';
      this.brighterPink = '#FF88CB';
      this.evenBrighterPink = '#FFDDFF';

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
        const randomOffset = this.random();
        const count = 4;
        for (let i = 0; i < count; i++) {
          if (this.random() < particleIntensity) {
            const angle = i / count * Math.PI * 2 + randomOffset * Math.PI * 2;
            const radius = Math.max(3, 0.9 + 2.7 * this.random());
            this.ps.spawn(
              8 + Math.cos(angle) * radius,  // x
              4.5 + Math.sin(angle) * radius,  // y
              this.random() * (0.3 + 0.7 * particleIntensity) * 0.2 * Math.cos(angle),  // dx
              this.random() * (0.3 + 0.7 * particleIntensity) * 0.2 * Math.sin(angle),  // dy
              angle,  // rotation
              particleIntensity * lerp(-0.1, 0.1, this.random()),  // rotationalSpeed
              1.5 * lerp(0.3, 0.6, this.random()),  // size
              this.random() > 0.5 ? '#3fbdcc' : 'white'
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
            /*
            this.ps.spawn(
              8 + Math.cos(angle) * radius,  // x
              4.5 + Math.sin(angle) * radius,  // y
              (0.3 + 0.7 * particleIntensity) * 0.2 * Math.cos(angle + Math.PI / 2),  // dx
              (0.3 + 0.7 * particleIntensity) * 0.2 * Math.sin(angle + Math.PI / 2),  // dy
              angle,  // rotation
              particleIntensity * lerp(0.08, 0.25, this.random()),  // rotationalSpeed
              lerp(0.3, 0.6, this.random())  // size
            );
            */
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
          uppermostPointIndex = i;
        }
      }
      let orderedDiamondPoints = [];
      for (let i = 0; i < diamondPoints.length; i++) {
        orderedDiamondPoints.push(diamondPoints[(uppermostPointIndex + i) % diamondPoints.length]);
      }
      const rightmostPoint = orderedDiamondPoints[1];
      const lowermostPoint = orderedDiamondPoints[2];
      const leftmostPoint = orderedDiamondPoints[3];

      let polygons;
      if (shrinkProgress < 1) {
        polygons = [
          {points:[ // top left
            {x: lerp(0, leftmostPoint.x, shrinkProgress), y: lerp(0, uppermostPoint.y, shrinkProgress)},
            {x: uppermostPoint.x, y: lerp(0, uppermostPoint.y, shrinkProgress)},
            uppermostPoint,
            leftmostPoint,
            {x: lerp(0, leftmostPoint.x, shrinkProgress), y: leftmostPoint.y},
          ]},
          {points:[ // top right
            {x: lerp(16, rightmostPoint.x, shrinkProgress), y: lerp(0, uppermostPoint.y, shrinkProgress)},
            {x: lerp(16, rightmostPoint.x, shrinkProgress), y: rightmostPoint.y},
            rightmostPoint,
            uppermostPoint,
            {x: uppermostPoint.x, y: lerp(0, uppermostPoint.y, shrinkProgress)},
          ]},
          {points:[ // bottom right
            {x: lerp(16, rightmostPoint.x, shrinkProgress), y: lerp(9, lowermostPoint.y, shrinkProgress)},
            {x: lowermostPoint.x, y: lerp(9, lowermostPoint.y, shrinkProgress)},
            lowermostPoint,
            rightmostPoint,
            {x: lerp(16, rightmostPoint.x, shrinkProgress), y: rightmostPoint.y},
          ]},
          {points:[ // bottom left
            {x: lerp(0, leftmostPoint.x, shrinkProgress), y: lerp(9, lowermostPoint.y, shrinkProgress)},
            {x: lerp(0, leftmostPoint.x, shrinkProgress), y: leftmostPoint.y},
            leftmostPoint,
            lowermostPoint,
            {x: lowermostPoint.x, y: lerp(9, lowermostPoint.y, shrinkProgress)},
          ]},
        ];
      } else {
        polygons = [];
        diamondSizeFactor *= Math.sqrt(2) / 2;

        const triangleRotationProgress = (frame - FRAME_FOR_BEAN(982)) / (FRAME_FOR_BEAN(994) - FRAME_FOR_BEAN(982));
        const triangleRotationOffset = smoothstep(0, Math.PI / 2, triangleRotationProgress);

        const firinMahLazorLeftProgress = (frame - FRAME_FOR_BEAN(1152)) / (FRAME_FOR_BEAN(1164) - FRAME_FOR_BEAN(1152));
        const firinMahLazorLeft = firinMahLazorLeftProgress >= 0 && firinMahLazorLeftProgress < 1;
        const firinMahLazorRightProgress = (frame - FRAME_FOR_BEAN(1172)) / (FRAME_FOR_BEAN(1188) - FRAME_FOR_BEAN(1172));
        const firinMahLazorRight = firinMahLazorRightProgress >= 0 && firinMahLazorRightProgress < 1;
        const lazorIntensity = Math.sqrt(
          Math.max(
            Math.sin(lerp(0, 1, firinMahLazorLeftProgress) * Math.PI),
            Math.sin(lerp(0, 1, firinMahLazorRightProgress) * Math.PI)
          )
        );
        const firinMahLazorOffsetX = (
          0.2 * lazorIntensity * Math.cos(1.1 * frame) +
          firinMahLazorLeft * 2.9 * Math.sin(lerp(0, 1, firinMahLazorLeftProgress) * Math.PI) -
          firinMahLazorRight * 2.9 * Math.sin(lerp(0, 1, firinMahLazorRightProgress) * Math.PI)
        );
        const firinMahLazorOffsetY = 0.09 * lazorIntensity * Math.sin(1.2 * frame);

        const preFireRotationProgress = (frame - FRAME_FOR_BEAN(1136)) / (FRAME_FOR_BEAN(1148) - FRAME_FOR_BEAN(1136));
        const oneEightyProgresses = [
          (frame - FRAME_FOR_BEAN(1055)) / (FRAME_FOR_BEAN(1072) - FRAME_FOR_BEAN(1056)),
          (frame - FRAME_FOR_BEAN(1075)) / (FRAME_FOR_BEAN(1085) - FRAME_FOR_BEAN(1076)),
          (frame - FRAME_FOR_BEAN(1091)) / (FRAME_FOR_BEAN(1106) - FRAME_FOR_BEAN(1092)),
          (frame - FRAME_FOR_BEAN(1114)) / (FRAME_FOR_BEAN(1130) - FRAME_FOR_BEAN(1116)),
        ];

        const triangleShooter1Progress = (frame - FRAME_FOR_BEAN(1188)) / (FRAME_FOR_BEAN(1200) - FRAME_FOR_BEAN(1188));
        const triangleShooter2Progress = (frame - FRAME_FOR_BEAN(1212)) / (FRAME_FOR_BEAN(1224) - FRAME_FOR_BEAN(1212));

        for (let i = 0; i < 4; i++) {
          const outProgress1 = (frame - FRAME_FOR_BEAN(958)) / (FRAME_FOR_BEAN(976) - FRAME_FOR_BEAN(958));
          const outProgress2 = (frame - FRAME_FOR_BEAN(996 + 3 * i)) / (FRAME_FOR_BEAN(1008 + 3 * i) - FRAME_FOR_BEAN(998 + 3 * i));

          const oneEightyProgress = oneEightyProgresses[i];

          const outFactor = Math.max(
            0,
            Math.sin(lerp(0, 1, outProgress1) * Math.PI),
            Math.sin(lerp(0, 1, outProgress2) * Math.PI),
            Math.sin(lerp(0, 1, oneEightyProgress) * Math.PI)
          );

          const angle = i * 2 * Math.PI / 4 +
            Math.PI / 4 -
            triangleRotationOffset -
            smoothstep(0, Math.PI / 4, outProgress2) +
            smoothstep(0, Math.PI / 4, preFireRotationProgress);
          const triangleAngle = smoothstep(0, Math.PI, oneEightyProgress);

          const horizontalScaler = 1 - 0.35 * lazorIntensity;
          const verticalScaler = 1 + 0.45 * lazorIntensity;

          let offsetX = 8 + horizontalScaler * diamondSizeFactor * Math.cos(angle) +
             1.5 * outFactor * Math.cos(angle) + firinMahLazorOffsetX;
          let offsetY = 4.5 + verticalScaler * diamondSizeFactor * Math.sin(angle) +
             1.5 * outFactor * Math.sin(angle) + firinMahLazorOffsetY;

          const polygon = {
            points: [{x: offsetX, y: offsetY}],
            color: this.pink,
          };
          for (let j = 0; j < 3; j++) {
            polygon.points.push(
              {
                x: offsetX + horizontalScaler * diamondSizeFactor * Math.cos(j * 2 * Math.PI / 4 - Math.PI / 2 + angle + triangleAngle),
                y: offsetY + verticalScaler * diamondSizeFactor * Math.sin(j * 2 * Math.PI / 4 - Math.PI / 2 + angle + triangleAngle),
              }
            );
          }
          polygons.push(polygon);

          // Triangle shooter
          const triangleShooterProgress = (i === 0 || i === 2 ? triangleShooter1Progress : triangleShooter2Progress);
          const numPolygons = lerp(0, 6, triangleShooterProgress) | 0;
          const stopPolygons = lerp(0, 6, triangleShooterProgress - 9/6) | 0;
          let brightness = 1;
          for (let k = 0; k < numPolygons; k++) {
            brightness += 0.14;

            if (k >= stopPolygons) {
              if (k === numPolygons - 1 && this.random() > 0.66 && (triangleShooterProgress >= 0 && triangleShooterProgress <= 1.15)) {
                //this.ps.spawn(offsetX, offsetY);
              }
              const polygon = {
                points: [{x: offsetX, y: offsetY}],
                color: `rgb(${Math.min(255, 227 * brightness)}, ${Math.min(255, 94 * brightness)}, ${Math.min(255, 161 * brightness)})`
              };
              for (let j = 0; j < 3; j++) {
                polygon.points.push(
                  {
                    x: offsetX + horizontalScaler * diamondSizeFactor * Math.cos(j * 2 * Math.PI / 4 - Math.PI / 2 + angle + triangleAngle + Math.PI),
                    y: offsetY + verticalScaler * diamondSizeFactor * Math.sin(j * 2 * Math.PI / 4 - Math.PI / 2 + angle + triangleAngle + Math.PI),
                    color: this.pink,
                  }
                );
              }
              polygons.push(polygon);
            }
            offsetX += 0.95 * Math.cos(angle);
            offsetY += 0.95 * Math.sin(angle);
          }
        }

        // Draw lazor
        if (firinMahLazorLeft || firinMahLazorRight) {
          const lazorOffsetX = firinMahLazorRight * 6;
          const lazorThickness = lazorIntensity;
          this.ctx.save();
          this.ctx.fillStyle = this.brighterPink;
          this.ctx.fillRect(lazorOffsetX, firinMahLazorOffsetY + 4.5 - lazorThickness / 2, 10, lazorThickness);
          this.ctx.fillStyle = 'white';
          this.ctx.fillRect(lazorOffsetX, firinMahLazorOffsetY + 4.5 - lazorThickness / 4, 10, lazorThickness / 2);
          this.ctx.restore();

          // Spawn lazor particles
          if (this.random() < lazorIntensity) {
            const direction = (firinMahLazorRight ? 1 : -1);
            const horizontalSpeed = 0.3 * direction;
            const verticalSpeed = 0.01 * (1 - 2 * this.random());
            const p = this.ps.spawn(
              8 + firinMahLazorOffsetX + 2.4 * direction + 8 * direction * this.random(), // x
              4.5 + firinMahLazorOffsetY + - lazorThickness / 2 + this.random() * lazorThickness, // y
              horizontalSpeed,  // dx
              verticalSpeed,  // dy
              firinMahLazorLeft ? Math.PI : 0,  // rotation
              0, // rotationalSpeed
              BEAT ? 0.15 : 0.34, // size,
              this.evenBrighterPink  // color
            );
            p.t = 28;
            p.shapeFunction = BEAT ? this.ps.renderStar : this.ps.renderWideRectangle;
          }
        }
      }

      for (let polygon of polygons) {
        this.ctx.save();
        for(let j = 0; j < 2; j++) {
          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.fillStyle = polygon.color;
          this.ctx.strokeStyle = polygon.color;
          if(j == 0) {
            this.ctx.fillStyle = '#041bb7';
            this.ctx.strokeStyle = '#041bb7';
            let shadowSize = easeIn(0, 0.15, F(this.frame, 960 - 12, 12));
            shadowSize = easeIn(shadowSize, 0, F(this.frame, 1128 - 12, 12));
            this.ctx.translate(shadowSize, shadowSize);
          }
          this.ctx.moveTo(polygon.points[0].x, polygon.points[0].y);
          for (let i = 1; i < polygon.points.length; i++) {
            this.ctx.lineTo(polygon.points[i].x, polygon.points[i].y);
          }

          this.ctx.closePath();
          this.ctx.fill();
          j == 1 && this.ctx.stroke();
          this.ctx.restore();
        }

        this.ctx.save();
        this.ctx.translate(8, 4.5);
        this.ctx.rotate(Math.PI / 16);

        const shadowSize = 0.3;
        const shadowColor = 'rgba(0, 0, 0, 0.3)';

        this.ctx.fillStyle = 'white';
        let animation = F(this.frame, 1248 + 12 * 2, 12);
        this.ctx.fillRect(4, easeIn(5, -6, animation), 5, easeOut(0, 10, animation));
        this.ctx.fillStyle = shadowColor;
        this.ctx.fillRect(4, easeIn(5, -6, animation), shadowSize, easeOut(0, 10, animation));
        this.ctx.fillStyle = '#00befc';
        animation = F(this.frame, 1248 + 12 * 2, 12);
        this.ctx.fillRect(0, -6, 4, easeOut(0, 11, animation));
        this.ctx.fillStyle = shadowColor;
        this.ctx.fillRect(0, -6, shadowSize, easeOut(0, 11, animation));

        this.ctx.fillStyle = 'white';
        animation = F(this.frame, 1248 + 12, 12);
        this.ctx.fillRect(-4, easeOut(6, -5, animation), 4, easeOut(0, 11, animation));
        this.ctx.fillStyle = shadowColor;
        this.ctx.fillRect(-4, easeOut(6, -5, animation), shadowSize, easeOut(0, 11, animation));

        this.ctx.fillStyle = '#00befc';
        this.ctx.fillRect(-9, -4, 5, easeOut(0, 10, F(this.frame, 1248, 12)));
        this.ctx.fillStyle = shadowColor;
        this.ctx.fillRect(-9, -4, 5, easeOut(0, shadowSize, F(this.frame, 1248, 12)));
        this.ctx.restore();

        this.ctx.restore();
      }
    }

    spawnPluses() {
      if (BEAT) {
        if (BEAN === 1028 || BEAN === 1128) {
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
            //this.ps.spawn(2, 2);
          }
        } else if (BEAN === 1040 || BEAN === 1136) {
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
            //this.ps.spawn(14, 2);
          }
        } else if (BEAN === 1044 || BEAN === 1140) {
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
            //this.ps.spawn(2, 7);
          }
        } else if (BEAN === 1052 || BEAN === 1148) {
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
            //this.ps.spawn(14, 7);
          }
        }
      }
    }
  }

  global.sleekAngles = sleekAngles;
})(this);
