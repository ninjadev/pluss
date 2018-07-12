(function(global) {

  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

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
      this.ps = new global.ParticleSystem({friction: 0.88, numParticles: 128, life: 35, shapes: [
        'JaggedLine',
        'WavyLine',
        'WideRectangle',
      ], colors: ['#666']});

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
        this.ctx.save();
        fn(blue);
        this.ctx.restore();
        this.ctx.restore();
        this.ctx.save();
        fn();
        this.ctx.restore();
      };


      this.alphabet = {
        ' ': {
          width: 0.5,
          render: () => 0,
        },
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
        H: {
          width: 1.75,
          render: t => {
            drawWithShadow(color => {
              const size = lerp(0, 0.75, t);
              const w = 1.75;
              this.ctx.fillStyle = color || green;
              this.ctx.fillRect(
                  -1. / 2 - size / 2,
                  lerp(-10, -1, t),
                  size,
                  2);
              this.ctx.fillStyle = color || purple;
              this.ctx.fillRect(
                lerp(-10, -w / 2, t),
                -size / 2,
                w,
                size);
              this.ctx.fillStyle = color || green;
              this.ctx.fillRect(
                  1. / 2 - size / 2,
                  lerp(-10, -1, t),
                  size,
                  2);
            });
          },
        },
        F: {
          width: 1.5,
          render: t => {
            drawWithShadow(color => {
              const size = lerp(0, 0.75, t);
              this.ctx.fillStyle = color || purple;
              this.ctx.fillRect(
                lerp(-10, -0.75, t),
                +0.25 - 0.75 / 2 - size / 2,
                1.25,
                size);
              this.ctx.fillStyle = color || green;
              this.ctx.fillRect(
                lerp(-10, -0.75, t),
                -0.25 - 0.75 / 2 - size / 2,
                1.5,
                size);
              this.ctx.fillStyle = color || green;
              this.ctx.fillRect(
                  -0.75 / 2 - size / 2,
                  lerp(-10, -1, t),
                  size,
                  2);
            });
          },
        },
        L: {
          width: 1.5,
          render: t => {
            drawWithShadow(color => {
              const size = lerp(0, 0.75, t);
              this.ctx.fillStyle = color || purple;
              this.ctx.fillRect(
                lerp(-10, -0.75, t),
                0.25 + 0.75 / 2 - size / 2,
                1.5,
                size);
              this.ctx.fillStyle = color || green;
              this.ctx.fillRect(
                  -0.75 / 2 - size / 2,
                  lerp(-10, -1, t),
                  size,
                  2);
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
        '-': {
          width: 1,
          render: () => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              const width = 1;
              this.ctx.fillRect(-width / 2, -.5 / 2, width, 0.5);
            });
          }
        },
        '.': {
          width: 0.5,
          render: () => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              this.ctx.fillRect(-.5 / 2, .5, 0.5, 0.5);
            });
          }
        },
        i: {
          width: 0.75,
          render: t => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              this.ctx.save();
              this.ctx.translate(0, 0.5);
              this.ctx.scale(1, 0.5);
              const width = lerp(0, 0.75, t);
              const height = easeIn(2, 1, t) + easeOut(-2, 1, t);
              this.ctx.fillRect(-width / 2,  -height / 2, width, height);
              this.ctx.restore();
              this.ctx.beginPath();
              const r= 0.75 / 2;
              this.ctx.fillStyle = purple;
              this.ctx.ellipse(0, -0.75, r, r, 0, 0, Math.PI * 2);
              this.ctx.fill();
            });
          },
        },
        S: {
          width: 1.5,
          render: t => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              this.ctx.beginPath();
              const spread = lerp(1, 1 / 3, t);
              const r = lerp(1, 0.5, spread);
              this.ctx.ellipse(lerp(0, -0.5, spread), lerp(0, 0.5, spread), r, r, -Math.PI / 4, 0, Math.PI);
              this.ctx.fill();
              this.ctx.fillStyle = color || purple;
              this.ctx.beginPath();
              this.ctx.ellipse(lerp(0, 0.5, spread), lerp(0, -0.5, spread), r, r, Math.PI -Math.PI / 4, 0, Math.PI);
              this.ctx.fill();
            });
          },
        },
        E: {
          width: 2,
          render: t => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;

              this.ctx.rotate(-Math.PI / 2);

              const height = lerp(0, 2, t);
              this.ctx.fillRect(-1, -height / 2, 2, height);

              this.ctx.fillStyle = color || purple;

              this.ctx.translate(-0.25 / 2, 0);
              this.ctx.translate(0, lerp(10, 0, t));
              this.ctx.beginPath();
              this.ctx.moveTo(0, 1.15);
              this.ctx.lineTo(0, -0.5);
              this.ctx.lineTo(-.5, 1.15);
              this.ctx.lineTo(0, 1.15);

              this.ctx.translate(0, lerp(5, 0, t));
              this.ctx.moveTo(.75, 1.15);
              this.ctx.lineTo(.75, -0.5);
              this.ctx.lineTo(.25, 1.15);
              this.ctx.lineTo(.75, 1.15);
              this.ctx.fill();
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
        N: {
          width: 2,
          render: t => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;

              const height = lerp(0, 2, t);
              this.ctx.fillRect(-1, -height / 2, 2, height);

              this.ctx.fillStyle = color || purple;

              this.ctx.translate(0, lerp(10, 0, t));
              this.ctx.beginPath();

              this.ctx.translate(0, lerp(5, 0, t));
              this.ctx.moveTo(.75, 1.15);
              this.ctx.lineTo(.25, -0.5);
              this.ctx.lineTo(.25, 1.15);
              this.ctx.lineTo(.75, 1.15);
              this.ctx.fill();
            });
          }
        },
        V: {
          width: 2,
          render: t => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;

              const height = lerp(0, 2, t);
              this.ctx.fillRect(-1, -height / 2, 2, height);

              this.ctx.fillStyle = color || purple;

              this.ctx.translate(0, lerp(10, 0, t));
              this.ctx.beginPath();

              this.ctx.translate(0, lerp(5, 0, t));
              this.ctx.moveTo(-.25, 0.25);
              this.ctx.lineTo(.25, -1.15);
              this.ctx.lineTo(-.25, -1.15);

              this.ctx.moveTo(1, -1);
              this.ctx.lineTo(1, 1);
              this.ctx.lineTo(0, 1);
              this.ctx.lineTo(1, -1);
              this.ctx.fill();
            });
          }
        },
        P: {
          width: 1.25,
          render: () => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              this.ctx.translate(1 -1.25 / 2, 0);
              this.ctx.fillRect(-1, -1, 0.5, 2);

              this.ctx.fillStyle = color || purple;
              const r = 0.75;
              this.ctx.beginPath();
              this.ctx.ellipse(-0.5, -0.25, r, r, 3 * Math.PI / 2, 0, Math.PI);
              this.ctx.fill();
            });
          }
        },
        R: {
          width: 1.25,
          render: () => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              this.ctx.translate(1 -1.25 / 2, 0);
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
          width: 1.5,
          render: () => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              const r = 1;
              this.ctx.translate(0.5 - 1.5 / 2, 0);
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
          width: 1.25,
          render: () => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              this.ctx.translate(0.5 - 1.25 / 2, 0);
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
        T: {
          width: 1.5,
          render: t => {
            drawWithShadow(color => {
              this.ctx.fillStyle = color || green;
              const width = lerp(0, 0.75, t);
              const crossbar = lerp(0, 1.5, t);
              const height = easeIn(2, 1, t) + easeOut(-2, 1, t);
              this.ctx.fillRect(-width / 2,  -height / 2, width, height);
              this.ctx.fillRect(-crossbar / 2, -1, crossbar, 0.75);
            });
          },
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

      if(BEAT && BEAN % 48 == 24) {
        for(let i = 0; i < 24; i++) {
          const angle = i / 24 * Math.PI * 2;
          const radius = 1 * Math.random();
          this.ps.spawn(
            8 + Math.cos(angle) * radius,  // x
            4.5 + Math.sin(angle) * radius,  // y
            (0.5 + 0.1 * Math.random()) * Math.cos(angle),  // dx
            (0.5 + 0.1 * Math.random()) * Math.sin(angle),  // dy
            angle,  // rotation
            0,
            0.5
          );
        }
      }

      this.ps.update();
    }

    renderScene(words) {

      this.ctx.save();
      this.ctx.scale(GU, GU);


      this.ctx.translate(-0.5, -0.25);
      for(let i = 0; i < 2; i++) {
        this.ctx.save();
        const shadowSize = easeOut(0, 0.15, F(this.frame, 2832, 24));
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

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.lineWidth = 0.07;
      this.ctx.lineCap = 'round';
      this.ctx.translate(12.5, -2.1);
      this.ctx.strokeStyle = '#ffad6b';
      this.ctx.rotate(Math.PI / 4);
      for(let j = 0; j < 28; j++) {
        for(let i = 13 - j / 5 * 3.5; i < 6 + j / 4 * 1.1; i++) {
          const width = easeOut(0, 0.01, F(this.frame, 2832 + i - 23 + j, 24));
          if(width > 0.009) {
            const x = (i + (j % 2 == 0 ? + 0.5 : 0)) / 3;
            const y = j / 3;
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + width, y);
          }
        }
      }
      this.ctx.stroke();
      this.ctx.restore();

      this.ctx.save();
      this.ctx.translate(0.7, -0.15);
      this.ps.render(this.ctx);
      this.ctx.restore();

      let selected = words[0];
      for(let i = 0; i < words.length; i++) {
        if(words[i].at >= BEAN) {
          break;
        }
        selected = words[i];
      }

      this.ctx.translate(8.5, 4.5);
      for(let i = 0; i < 2; i++) {
        this.ctx.save();
        this.ctx.rotate(-Math.PI / 64);
        this.ctx.font = 'bold 2px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.save();
        let totalWidth = 0;
        const padding = 0.25;
        for(let letter of selected.word) {
          if(letter in this.alphabet) {
            totalWidth += this.alphabet[letter].width;
          }
        }
        totalWidth += (selected.word.length - 1) * padding;

        this.ctx.scale(0.75, 0.75);
        this.ctx.translate(-totalWidth / 2, 0);
    
        for(let letter of selected.word) {
          if(letter in this.alphabet) {
            this.ctx.translate(this.alphabet[letter].width / 2, 0);

            this.alphabet[letter].render(easeOut(0, 1, F(this.frame, selected.at, 12)));
            this.ctx.fillStyle = 'white';
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 0.05;
            const width = this.alphabet[letter].width;
            /*
            const height = 2;
            this.ctx.strokeRect(-width / 2, -height / 2, width, height);
            */
            this.ctx.translate(width / 2, 0);

            this.ctx.translate(padding, 0);
          }
        }
        this.ctx.restore();
        this.ctx.restore();
      }


      this.ctx.restore();
    }

    render() {

      this.ctx.fillStyle = '#fffc00';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      
      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.translate(-this.frame / 40 % (2 * Math.PI * 2), 0);
      this.ctx.beginPath();
      this.ctx.rotate(Math.PI / 8);
      this.ctx.globalAlpha = 0.5;
      for(let i = -0; i < 30; i++) {
        for(let j = -20; j < 10; j++) {
          const scale = easeOut(0, 1, F(this.frame, 2832 + i / 2 + j / 2, 24));
          if(scale) {
            this.ctx.save();
            this.ctx.translate(i, j);
            this.ctx.scale(scale, scale);
            const length = 0.5;
            this.ctx.moveTo(- length / 2, 0);
            this.ctx.lineTo(+ length / 2, 0);

            this.ctx.moveTo(0, - length / 2);
            this.ctx.lineTo(0, + length / 2);
            this.ctx.restore();
          }
        }
      }
      this.ctx.strokeStyle = '#f5ce18';
      this.ctx.lineWidth = 0.1;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();
      this.ctx.restore();

      if(BEAN < 3024 + 48 * 2) {
        this.renderScene([
            {word: 'NINJADEV', at: 2784 + 48},
            {word: 'IS', at: 2832 + 48},
            {word: 'BACK!', at: 2880 + 48},
            {word: 'POo-BRAIN', at: 2928 + 48},
            {word: 'LFT', at: 2976},
        ]);
      } else {
        this.ctx.save();
        this.ctx.scale(1 / 3, 1 / 3);
        this.renderScene([
            {word: 'P01', at: 2976},
            {word: 'STILL', at: 2976 + 48},
            {word: 'EXCESS', at: 3072},
            {word: 'RAMON', at: 3072 + 24},
        ]);
        this.ctx.translate(16 * GU, 0);
        this.renderScene([
            {word: 'COCOON', at: 2976 + 48},
            {word: '0x415', at: 3072},
            {word: 'PRISMBEINGS', at: 3072 + 24},
            {word: 'LOONIES', at: 3072 + 2 * 24},
        ]);
        this.ctx.translate(16 * GU, 0);
        this.renderScene([
            {word: 'KEYBOARDERS', at: 2976},
            {word: 'FAIRLIGHT', at: 2976 + 48},
            {word: 'SCHNAPPSGIRLS', at: 3072 + 2 * 24},
            {word: 'SPACEPIGS', at: 3072 + 3 * 24},
        ]);

        this.ctx.translate(-32 * GU, 9 * GU);
        this.ctx.translate(-8 * GU, 0);
        this.renderScene([
            {word: 'EPHIDRENA', at: 3072 + 3 * 24},
            {word: 'CONSPIRACY', at: 2976},
            {word: 'THE DEADLINERS', at: 2976 + 48},
            {word: 'LoGICOMA', at: 3072},
            {word: 'MR. DOOB', at: 3072 + 24},
            {word: 'LoGICOMA', at: 3072 + 2 * 24},
            {word: 'MR. DOOB', at: 3072 + 3 * 24},
        ]);
        this.ctx.translate(16 * GU, 0);
        this.renderScene([
            {word: 'LoGICOMA', at: 3072},
            {word: 'MR. DOOB', at: 3072 + 24},
            {word: 'LoGICOMA', at: 3072 + 2 * 24},
            {word: 'MR. DOOB', at: 3072 + 3 * 24},
        ]);
        this.ctx.translate(16 * GU, 0);
        this.renderScene([
            {word: 'LoGICOMA', at: 3072},
            {word: 'MR. DOOB', at: 3072 + 24},
            {word: 'LoGICOMA', at: 3072 + 2 * 24},
            {word: 'MR. DOOB', at: 3072 + 3 * 24},
        ]);
        this.ctx.translate(16 * GU, 0);
        this.renderScene([
            {word: 'LoGICOMA', at: 3072},
            {word: 'MR. DOOB', at: 3072 + 24},
            {word: 'LoGICOMA', at: 3072 + 2 * 24},
            {word: 'MR. DOOB', at: 3072 + 3 * 24},
        ]);

        this.ctx.translate(-(48) * GU, 9 * GU);
        this.ctx.translate(8 * GU, 0);
        this.renderScene([
            {word: 'LoGICOMA', at: 3072},
            {word: 'MR. DOOB', at: 3072 + 24},
            {word: 'LoGICOMA', at: 3072 + 2 * 24},
            {word: 'MR. DOOB', at: 3072 + 3 * 24},
        ]);
        this.ctx.translate(16 * GU, 0);
        this.renderScene([
            {word: 'LoGICOMA', at: 3072},
            {word: 'MR. DOOB', at: 3072 + 24},
            {word: 'LoGICOMA', at: 3072 + 2 * 24},
            {word: 'MR. DOOB', at: 3072 + 3 * 24},
        ]);
        this.ctx.translate(16 * GU, 0);
        this.renderScene([
            {word: 'LoGICOMA', at: 3072},
            {word: 'MR. DOOB', at: 3072 + 24},
            {word: 'LoGICOMA', at: 3072 + 2 * 24},
            {word: 'MR. DOOB', at: 3072 + 3 * 24},
        ]);

        this.ctx.restore();
      }
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
