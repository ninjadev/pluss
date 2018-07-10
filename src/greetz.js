(function(global) {
  class greetz extends NIN.THREENode {
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

      const green = '#00ffc6';
      const blue = '#1232ff';
      const purple = '#ff00ea';
      this.green = green;
      this.blue = blue;
      this.purple = purple;

      const drawWithShadow = (fn) => {
        this.ctx.save();
        const shadowSize = 0.05;
        this.ctx.translate(shadowSize, shadowSize * 3);
        this.ctx.fillStyle = 'blue';
        this.ctx.save();
        fn(blue);
        this.ctx.restore();
        this.ctx.restore();
        this.ctx.save();
        fn();
        this.ctx.restore();
      };


      this.alphabet = {
        A: {
          width: 2,
          render: t => {
            drawWithShadow(color => {
              this.ctx.rotate(Math.PI / 2);
              this.ctx.fillStyle = color || green;
              const r = lerp(0, 1, t);
              this.ctx.beginPath();
              this.ctx.moveTo(lerp(0, 1, t), lerp(0, -1, t));
              this.ctx.lineTo(0, lerp(0, -1, t));
              this.ctx.ellipse(0, 0, r, r, Math.PI / 2, 0, Math.PI);
              this.ctx.lineTo(0, lerp(0, 1, t));
              this.ctx.lineTo(easeOut(0, 1, t), lerp(0, 1, t));
              this.ctx.fill();
              const r2 = lerp(0, 0.5, t);
              this.ctx.fillStyle = color || purple;
              this.ctx.beginPath();
              this.ctx.ellipse(0, 0, r2, r2, Math.PI / 2, 0, Math.PI);
              this.ctx.fill();
            });
          }
        },
        C: {
          width: 1.75,
          render: t => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              const r = 1;
              this.ctx.beginPath();
              this.ctx.translate(0.25 / 2, 0);
              this.ctx.moveTo(0, 0);
              this.ctx.ellipse(0, 0, r, r, Math.PI / 2, 0, lerp(0, Math.PI, t));
              this.ctx.fillRect(-0.01, lerp(-10, -1, t), 0.7501, 2);
              this.ctx.fill();
            });
          },
        },
        L: {
          width: 1.5,
          render: t => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              const size = lerp(0, 0.75, t);
              this.ctx.fillRect(
                  -0.75 / 2 - size / 2,
                  lerp(-10, -1, t),
                  size,
                  2);
              this.ctx.fillRect(
                lerp(-10, -0.75, t),
                0.25 + 0.75 / 2 - size / 2,
                1.5,
                size);
            });
          },
        },
        G: {
          width: 2.0,
          render: t => {
            drawWithShadow(color => {
              const r = lerp(0, 1, t);
              this.ctx.fillStyle = color || green;
              this.ctx.beginPath();
              this.ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2);
              this.ctx.fill();

              const size = lerp(0, Math.PI / 4, t / 2 + 0.5);
              this.ctx.fillStyle = color || purple;
              this.ctx.beginPath();
              this.ctx.rotate(-size * 17);
              this.ctx.moveTo(0, 0);
              this.ctx.lineTo(r * 1.1, 0);
              this.ctx.ellipse(0, 0, r * 1.1, r * 1.1, 0, 0, size);
              this.ctx.lineTo(0, 0);
              this.ctx.fill();
            });
          }
        },
        '.': {
          width: 1.3,
          render: () => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              this.ctx.fillRect(-.5 / 2, .5, 0.5, 0.5);
            });
          }
        },
        M: {
          width: 2,
          render: t => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;

              const height = lerp(0, 2, t);
              this.ctx.fillRect(-1, -height / 2, 2, height);

              this.ctx.fillStyle = color || purple;

              this.ctx.translate(0, lerp(10, 0, t));
              this.ctx.beginPath();
              this.ctx.moveTo(0, 1.15);
              this.ctx.lineTo(-.5, -0.5);
              this.ctx.lineTo(-.5, 1.15);
              this.ctx.lineTo(0, 1.15);

              this.ctx.translate(0, lerp(5, 0, t));
              this.ctx.moveTo(.75, 1.15);
              this.ctx.lineTo(.25, -0.5);
              this.ctx.lineTo(.25, 1.15);
              this.ctx.lineTo(.75, 1.15);
              this.ctx.fill();
            });
          }
        },
        R: {
          width: 1,
          render: () => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              this.ctx.fillRect(-1, -1, 0.5, 2);

              this.ctx.fillStyle = color || purple;
              const r = 0.75;
              this.ctx.beginPath();
              this.ctx.ellipse(-0.5, -0.25, r, r, 3 * Math.PI / 2, 0, Math.PI);
              this.ctx.moveTo(-0.5, -1);
              this.ctx.lineTo(0.25, 1);
              this.ctx.lineTo(-0.5, 1);
              this.ctx.fill();
            });
          }
        },
        D: {
          width: 2.3,
          render: () => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              const r = 1;
              this.ctx.beginPath();
              this.ctx.moveTo(-0.5, -1);
              this.ctx.lineTo(0, -1);
              this.ctx.ellipse(0, 0, r, r, 3 * Math.PI / 2, 0, Math.PI);
              this.ctx.lineTo(-0.5, 1);
              this.ctx.lineTo(-0.5, -1);
              this.ctx.fill();
            });
          }
        },
        B: {
          width: 2.3,
          render: () => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              const r = 0.5;
              this.ctx.beginPath();
              this.ctx.moveTo(-0.5, -1);
              this.ctx.lineTo(0, -1);
              this.ctx.ellipse(0, -0.5, r, r, 3 * Math.PI / 2, 0, Math.PI);
              this.ctx.lineTo(-0.5, 1);
              this.ctx.lineTo(-0.5, -1);
              this.ctx.ellipse(0, 0.25, r * 1.5, r * 1.5, 3 * Math.PI / 2, 0, Math.PI);
              this.ctx.lineTo(-0.5, 1);
              this.ctx.lineTo(-0.5, -1);
              this.ctx.fill();
            });
          }
        },
        I: {
          width: 0.75,
          render: t => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              const width = lerp(0, 0.75, t);
              const height = easeIn(2, 1, t) + easeOut(-2, 1, t);
              this.ctx.fillRect(-width / 2,  -height / 2, width, height);
            });
          },
        },
        o: {
          width: 2,
          render: t => this.alphabet.O.render(t, true)
        },
        O: {
          width: 2,
          render: (t, inverse) => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              const r = lerp(0, 1, t);
              this.ctx.beginPath();
              this.ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2);
              this.ctx.fill();
              this.ctx.fillStyle = color || purple;
              const r2 = easeIn(0, 0.5, t);
              const xOffset = 0.25 * Math.sin(lerp(0, Math.PI * 2, t));
              const yOffset = 0.25 * Math.cos(lerp(0, Math.PI * 2, t)) * (inverse ? -1 : 1);
              this.ctx.beginPath();
              this.ctx.ellipse(
                xOffset,
                yOffset,
                r2, r2, 0, 0, Math.PI * 2);
              this.ctx.fill();
            });
          }
        }
      };
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;
    }

    render() {
      this.ctx.fillStyle = '#fffc00';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.translate(-0.5, -0.25);
      for(let i = 0; i < 2; i++) {
        this.ctx.save();
        const shadowSize = 0.15;
        this.ctx.fillStyle = 'white';
        if(i == 0) {
          this.ctx.translate(shadowSize, shadowSize * 3);
          this.ctx.fillStyle = this.purple;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(5, 3);
        this.ctx.lineTo(9, 7.5);
        this.ctx.lineTo(12, 2);
        this.ctx.lineTo(5, 3);
        this.ctx.fill();
        this.ctx.restore();
      }

      this.ctx.translate(8.5, 4.5);
      for(let i = 0; i < 2; i++) {
        this.ctx.save();
        this.ctx.rotate(-Math.PI / 64);
        this.ctx.font = 'bold 2px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.save();
        let word = 'LoGICOMA';
        if(BEAN >= 2832) {
          word = 'MR.DOoB';
        }
        let totalWidth = 0;
        const padding = 0.25;
        for(let letter of word) {
          if(letter in this.alphabet) {
            totalWidth += this.alphabet[letter].width;
          }
        }
        totalWidth += (word.length - 1) * padding;

        this.ctx.scale(0.75, 0.75);
        this.ctx.translate(-totalWidth / 2, 0);
    
        for(let letter of word) {
          if(letter in this.alphabet) {
            this.ctx.translate(this.alphabet[letter].width / 2, 0);

            if(BEAN >= 2832) {
              this.alphabet[letter].render(easeOut(0, 1, (this.frame - FRAME_FOR_BEAN(2832)) / (FRAME_FOR_BEAN(2832 + 12) - FRAME_FOR_BEAN(2832))));
            } else if (BEAN >= 2784) {
              this.alphabet[letter].render(easeOut(0, 1, (this.frame - FRAME_FOR_BEAN(2784)) / (FRAME_FOR_BEAN(2784 + 12) - FRAME_FOR_BEAN(2784))));
            }
            this.ctx.fillStyle = 'white';
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 0.05;
            const width = this.alphabet[letter].width;
            //this.ctx.strokeRect(-width / 2, -height / 2, width, height);
            this.ctx.translate(width / 2, 0);

            this.ctx.translate(padding, 0);
          }
        }
        this.ctx.restore();
        //this.ctx.fillText('GROUP', 0, 0);
        this.ctx.restore();
      }


      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }
  }

  global.greetz = greetz;
})(this);
