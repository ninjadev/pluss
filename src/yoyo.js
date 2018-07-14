(function(global) {

  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

  class yoyo extends NIN.THREENode {
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

      this.square = () => {
        this.ctx.fillRect(-0.5, -0.5, 1, 1);
      };

      this.triangle = () => {
        this.ctx.beginPath();
        const radius = 1 / Math.sqrt(2);
        for (let i = 0; i < 3; i++) {
          const angle = Math.PI * 2 * i / 3;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          if (i == 0) {
            this.ctx.moveTo(x, y);
          }
          this.ctx.lineTo(x, y);
        }
        this.ctx.fill();
      };

      this.hexagon = () => {
        this.ctx.beginPath();
        const radius = 1 / Math.sqrt(2);
        for (let i = 0; i < 6; i++) {
          const angle = Math.PI * 2 * i / 6;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          if (i === 0) {
            this.ctx.moveTo(x, y);
          }
          this.ctx.lineTo(x, y);
        }
        this.ctx.fill();
      };

      this.circle = () => {
        this.ctx.beginPath();
        const radius = 1 / Math.sqrt(2);
        this.ctx.ellipse(0, 0, radius, radius, 0, 0, Math.PI * 2);
        this.ctx.fill();
      };
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

      // This clears the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.translate(8, 4.5);
      const cameraZoom = smoothstep(0.1, 1, F(this.frame, 1296, 12));
      this.ctx.scale(cameraZoom, cameraZoom);

      const green = '#7AF0CE';
      this.green = green;
      const yellow = '#fffc00';
      const lightPink = '#f442e8';
      const pink = lightPink;

      const colorsList = [
        [green, lightPink, yellow, pink],
        [pink, green, lightPink, yellow],
        [yellow, pink, green, lightPink],
        [lightPink, yellow, pink, green],
        [green, lightPink, yellow, pink],
        [pink, green, lightPink, yellow],
        [yellow, pink, green, lightPink],
        [lightPink, yellow, pink, green],
        [green, lightPink, yellow, pink],
        [pink, green, lightPink, yellow],
        [yellow, pink, green, lightPink],
        [lightPink, yellow, pink, green],

        [green, lightPink, yellow, pink],
      ];

      let colors = colorsList[0];
      if (BEAN >= 4392) {
        colors = colorsList[10];
      } else if (BEAN >= 33 * 48) {
        colors = colorsList[9];
      } else if (BEAN >= 32.5 * 48 - 4) {
        colors = colorsList[8];
      } else if (BEAN >= 31 * 48) {
        colors = colorsList[7];
      } else if (BEAN >= 1344 - 4 + 12) {
        colors = colorsList[3];
      } else if (BEAN >= 1344 - 4) {
        colors = colorsList[1];
      }


      this.ctx.save();
      this.ctx.fillStyle = colors[0];
      this.ctx.scale(1 / cameraZoom, 1 / cameraZoom);

      const shadowSize = 0.3;
      const shadowColor = 'rgba(0, 0, 0, 0.3)';

      if (BEAN < 1680) {
        // Stripy blue/white background
        this.ctx.fillRect(-80, -4.5, 160, 9);

        this.ctx.save();
        this.ctx.translate(-4 * 8, 0);
        this.ctx.translate(16 - 4.4 - (this.frame - 2045) / 100, 0);
        this.ctx.rotate(Math.PI / 16);

        for (let i = 0; i < 8; i++) {
          this.ctx.translate(4, 0);
          this.ctx.fillStyle = i % 2 ? '#00befc' : 'white';
          this.ctx.fillRect(4, -100, 5, 200);
          this.ctx.fillStyle = shadowColor;
          this.ctx.fillRect(4, -100, shadowSize, 200);
        }
        this.ctx.restore();
      } else if (BEAN >= 1872) {
        // solid green-ish background
        this.ctx.fillStyle = this.green;
        this.ctx.fillRect(-16, -9, 16 * 2, 9 * 2);

        // white circles with shadow
        let numCircles = 1;
        if (BEAN >= 1892 && BEAN < 1916) {
          numCircles = 2;
        } else if (BEAN >= 1916 && BEAN < 1940) {
          numCircles = 3;
        } else if (BEAN >= 1940) {
          numCircles = 4;
        }

        for (let i = 0; i < numCircles; i++) {
          let scaler = 1;
          if (BEAN >= 1892 && BEAN < 1896) {
            if (i === 1) {
              scaler = 0.5;
            }
          } else if (BEAN >= 1916 && BEAN < 1928) {
            if (i === 2) {
              scaler = 0.5;
            }
          } else if (BEAN >= 1928 && BEAN < 1940) {
            if (i === 2) {
              scaler = 0.75;
            }
          } else if (BEAN >= 1940 && BEAN < 1944) {
            if (i === 3) {
              scaler = 0.5;
            }
          }
          scaler *= easeOut(1, 0, F(this.frame, 1956, 9));
          this.ctx.save();
          this.ctx.translate(-5 + i * 3.25, 0);
          this.ctx.scale(2 * scaler, 2 * scaler);

          // shadow
          this.ctx.fillStyle = shadowColor;
          this.ctx.save();
          this.ctx.translate(0.08, 0.08);
          this.circle();
          this.ctx.restore();

          // circle body
          this.ctx.fillStyle = 'white';
          this.circle();
          this.ctx.restore();
        }
      } else {
        // transparent background, to mix in the banana shader
      }

      this.ctx.restore();

      let shape = this.square;

      if (BEAN >= 35 * 48) {
        if (BEAN >= 1776 && BEAN < 1860) {
          shape = this.hexagon;
        } else {
          shape = this.circle;
        }
      } else if (BEAN >= 30.5 * 48) {
        shape = this.triangle;
      }


      if (BEAN >= 1440 - 4  && BEAN < 1440 + 24 + 24) {
        for (let i = 0; i < 2; i++) {
          this.ctx.save();
          this.ctx.fillStyle = colors[0];
          if (i === 0) {
            this.ctx.fillStyle = colors[1];
            const shadowSize = 0.15;
            this.ctx.translate(shadowSize, shadowSize);
          }
          const duration = 12;
          if (BEAN >= 1440 - 4 && BEAN < 1440 + duration) {
            this.ctx.save();
            this.ctx.translate(-3.65, -2.5);
            this.ctx.fillRect(-1, -1, 2, 2);
            this.ctx.restore();
          }

          /*
          if (BEAN >= 1440 + 4 && BEAN <= 1440 + 4 + duration) {
            this.ctx.save();
            this.ctx.translate(0, -2.5);
            this.ctx.fillRect(-1, -1, 2, 2);
            this.ctx.restore();
          }
          */

          if (BEAN >= 1440 + 12 + 8 && BEAN < 1440 + 12 + 8 + duration) {
            this.ctx.save();
            this.ctx.translate(3.65, 2.5);
            this.ctx.fillRect(-1, -1, 2, 2);
            this.ctx.restore();
          }

          /*
          if (BEAN >= 1440 + 12 && BEAN <= 1440 + 12 + duration) {
            this.ctx.save();
            this.ctx.translate(-3.65, 2.5);
            this.ctx.fillRect(-1, -1, 2, 2);
            this.ctx.restore();
          }
          */

          if (BEAN >= 1440 + -4 + 12 && BEAN < 1464) {
            this.ctx.save();
            this.ctx.translate(0, 0);
            this.ctx.fillRect(-1, -1, 2, 2);
            this.ctx.restore();
          }

          /*
          if (BEAN >= 1440 + 20 && BEAN <= 1440 + 20 + duration) {
            this.ctx.save();
            this.ctx.translate(3.65, 2.5);
            this.ctx.fillRect(-1, -1, 2, 2);
            this.ctx.restore();
          }
          */
          this.ctx.restore();
        }
      }

      // Three shapes
      if (BEAN < 1860) {
        for (let i = 0; i < 3; i++) {
          if (BEAN < 1368 && i > 0) {
            break;
          }
          if (BEAN >= 1440 - 4 && BEAN < 1464) {
            break;
          }
          this.ctx.save();
          let wobbleOffset = 0;
          if(BEAN >= 1680) {
            wobbleOffset = Math.PI;
          }
          let wobbler = 0.5 * Math.sin(wobbleOffset + this.frame * Math.PI * 2 / 60 / 60 * 190 / 2);

          if (BEAN >= 1340 - 4 && BEAN < 1392) {
            wobbler = lerp(wobbler, 0, F(this.frame, 1340-4, 4));
          }
          if (BEAN >= 1464 - 24 && BEAN < 1488) {
            wobbler = lerp(wobbler, 0, F(this.frame, 1464 - 24, 4));
          }

          let scale = 1 + (3 - i) + wobbler;
          let squeezeProgress = F(this.frame, 1760, 19);
          let squeezeIntensity = Math.sqrt(Math.sin(lerp(0, 1, squeezeProgress) * Math.PI));
          let horizontalScaler = scale * (1 + 1.2 * squeezeIntensity);
          let verticalScaler = scale * (1 - 0.6 * squeezeIntensity);
          this.ctx.scale(horizontalScaler, verticalScaler);

          if (i === 0) {
            let x = lerp(0, -1, BEAN - 1356 - 4);
            x = easeIn(x, 0, F(this.frame, 1392 - 12, 12));
            x = lerp(x, -1, BEAN - 1464 + 1);
            x = easeIn(x, 0, F(this.frame, 1488 - 12, 12));
            const y = 0;
            this.ctx.translate(x, y);
          } else if (i === 1) {
            let x = easeIn(0, 0.2, F(this.frame, 1368 - 12, 12));
            x = easeIn(x, 0, F(this.frame, 1392 - 12, 12));
            x = lerp(x, 0.2, BEAN - 1464 + 1);
            x = easeIn(x, 0, F(this.frame, 1488 - 12, 12));
            if (BEAN < 1368) {
              x = 1000;
            }
            let y = 0;
            if (BEAN >= 1680) {
              x += easeIn(
                0.12 * Math.cos(this.frame * Math.PI * 2 / 60 / 60 * 190 / 4),
                0,
                F(this.frame, 1760 - 4, 4));
              y += easeIn(
                0.12 * Math.sin(this.frame * Math.PI * 2 / 60 / 60 * 190 / 4),
                0,
                F(this.frame, 1760 - 4, 4));
            }
            this.ctx.translate(x, y);
          } else if (i === 2) {
            let x = easeIn(0, 2.2, F(this.frame, 1368 - 12, 12));
            x = easeIn(x, 0, F(this.frame, 1392 - 12, 12));
            x = lerp(x, 2.2, BEAN - 1464 - 1);
            x = easeIn(x, 0, F(this.frame, 1488 - 12, 12));
            if (BEAN < 1376) {
              x = 1000;
            }
            if (BEAN >= 1464 && BEAN < 1464 + 8) {
              x = 1000;
            }
            const y = 0;
            this.ctx.translate(x, y);
          }

          this.ctx.fillStyle = 'rgba(0,0,0,0.85)';
          this.ctx.save();
          const shadowSize = 0.15;
          this.ctx.translate(shadowSize / scale, shadowSize / scale);
          let rotation = Math.PI / 4 + this.frame / 50 + 0.89;
          if (BEAN >= 1340 && BEAN < 1392) {
            rotation = 0;
          }
          if (BEAN >= 1356 - 4 && BEAN < 1392) {
            rotation = Math.PI / 4;
          }
          if (BEAN >= 1368 && BEAN < 1392) {
            rotation = 0;
          }
          if (BEAN >= 1368 + 8 && BEAN < 1392) {
            rotation = Math.PI / 4;
          }
          if (BEAN >= 1464 + 8 && BEAN < 1488) {
            rotation = 0;
          }
          this.ctx.rotate(rotation);
          shape();
          this.ctx.restore();
          this.ctx.rotate(rotation);
          this.ctx.fillStyle = colors[1 + i];
          shape();
          this.ctx.restore();
        }
      }

      // tunnel
      if (BEAN >= 1856 && BEAN < 1872) {
        const tunnelProgress = F(this.frame, 1824, 64);
        const lastHitProgress = F(this.frame, 1944, 12);
        //const twistProgress = F(this.frame, 1896, 48);
        this.ctx.scale(16, 16);
        const numTunnelBands = 131;
        for (let i = 0; i < numTunnelBands; i++) {
          let radius = 1 / (5 + (tunnelProgress * 16 + easeOut(0, 90, lastHitProgress) - i));
          if (i === numTunnelBands - 1) {
            this.ctx.fillStyle = this.green;
            radius = 0.1;
          } else {
            this.ctx.fillStyle = colors[1 + (i % 3)];
            if (Math.abs(radius) < 0.1) {
              continue;
            }
          }
          this.ctx.save();
          this.ctx.scale(radius, radius);
          /*this.ctx.globalAlpha = Math.pow(
            Math.max(0, Math.min(1, Math.abs(radius * 9))),
            4
          );*/

          //this.ctx.rotate(0.0666 * i * easeOut(0, 1, twistProgress));
          this.hexagon();
          this.ctx.restore();
        }
      }


      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.yoyo = yoyo;
})(this);
