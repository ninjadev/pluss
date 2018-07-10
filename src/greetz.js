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

      this.alphabet = {
        G: {
          width: 2.3,
          render: () => {
            const r = 1;
            for(let i = 0; i < 2; i++) {
              this.ctx.fillStyle = '#00ffc6';
              this.ctx.save();
              const shadowSize = 0.05;
              if(i == 0) {
                this.ctx.translate(shadowSize, shadowSize * 3);
                this.ctx.fillStyle = '#1232ff';
              }
              this.ctx.beginPath();
              this.ctx.lineWidth = 0.1;
              this.ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2);
              this.ctx.fill();
              this.ctx.restore();
            }
            this.ctx.fillStyle = '#ff00ea';
            for(let i = 0; i < 2; i++) {
              this.ctx.save();
              const shadowSize = 0.05;
              if(i == 0) {
                this.ctx.fillStyle = '#1232ff';
                this.ctx.translate(shadowSize, shadowSize * 3);
              }
              this.ctx.beginPath();
              this.ctx.rotate(-Math.PI / 4);
              this.ctx.moveTo(0, 0);
              this.ctx.lineTo(r * 1.1, 0);
              this.ctx.ellipse(0, 0, r * 1.1, r * 1.1, 0, 0, Math.PI / 4);
              this.ctx.lineTo(0, 0);
              this.ctx.fill();
              this.ctx.restore();
            }
            this.ctx.restore();
          },
        },
        '.': {
          width: 1.3,
          render: () => {
            this.ctx.save();
            for(let i = 0; i < 2; i++) {
              this.ctx.fillStyle = '#00ffc6';
              this.ctx.save();
              const shadowSize = 0.05;
              if(i == 0) {
                this.ctx.translate(shadowSize, shadowSize * 3);
                this.ctx.fillStyle = '#1232ff';
              }
              this.ctx.fillRect(-.5 / 2, .5, 0.5, 0.5);
              this.ctx.restore();
            }
            this.ctx.restore();
          }
        },
        M: {
          width: 2.3,
          render: () => {
            this.ctx.save();
            for(let i = 0; i < 2; i++) {
              this.ctx.fillStyle = '#00ffc6';
              this.ctx.save();
              const shadowSize = 0.05;
              if(i == 0) {
                this.ctx.translate(shadowSize, shadowSize * 3);
                this.ctx.fillStyle = '#1232ff';
              }
              this.ctx.fillRect(-1, -1, 2, 2);
              this.ctx.restore();
            }

            for(let i = 0; i < 2; i++) {
              this.ctx.fillStyle = '#ff00ea';
              this.ctx.save();
              const shadowSize = 0.05;
              if(i == 0) {
                this.ctx.fillStyle = '#1232ff';
                this.ctx.translate(shadowSize, shadowSize * 3);
              }
              this.ctx.beginPath();
              this.ctx.moveTo(-.75 + 0.75, 1.15);
              this.ctx.lineTo(-.75 + .25, -0.5);
              this.ctx.lineTo(-.75 + .25, 1.15);
              this.ctx.lineTo(-.75 + .75, 1.15);

              this.ctx.moveTo( + 0.75, 1.15);
              this.ctx.lineTo( + .25, -0.5);
              this.ctx.lineTo( + .25, 1.15);
              this.ctx.lineTo( + .75, 1.15);
              this.ctx.fill();
              this.ctx.restore();
            }
            this.ctx.restore();
          }
        },
        R: {
          width: 1,
          render: () => {
            for(let i = 0; i < 2; i++) {
              this.ctx.fillStyle = '#00ffc6';
              this.ctx.save();
              const shadowSize = 0.05;
              if(i == 0) {
                this.ctx.translate(shadowSize, shadowSize * 3);
                this.ctx.fillStyle = '#1232ff';
              }
              this.ctx.fillRect(-1, -1, 0.5, 2);
              this.ctx.restore();
            }
            for(let i = 0; i < 2; i++) {
              this.ctx.fillStyle = '#ff00ea';
              this.ctx.save();
              const shadowSize = 0.05;
              if(i == 0) {
                this.ctx.translate(shadowSize, shadowSize * 3);
                this.ctx.fillStyle = '#1232ff';
              }
              const r = 0.75;
              this.ctx.beginPath();
              this.ctx.ellipse(-0.5, -0.25, r, r, 3 * Math.PI / 2, 0, Math.PI);
              this.ctx.moveTo(-0.5, -1);
              this.ctx.lineTo(0.25, 1);
              this.ctx.lineTo(-0.5, 1);
              this.ctx.fill();
              this.ctx.restore();
            }
          }
        },
        D: {
          width: 2.3,
          render: () => {
            for(let i = 0; i < 2; i++) {
              this.ctx.fillStyle = '#00ffc6';
              this.ctx.save();
              const shadowSize = 0.05;
              if(i == 0) {
                this.ctx.translate(shadowSize, shadowSize * 3);
                this.ctx.fillStyle = '#1232ff';
              }
              const r = 1;
              this.ctx.beginPath();
              this.ctx.moveTo(-0.5, -1);
              this.ctx.lineTo(0, -1);
              this.ctx.ellipse(0, 0, r, r, 3 * Math.PI / 2, 0, Math.PI);
              this.ctx.lineTo(-0.5, 1);
              this.ctx.lineTo(-0.5, -1);
              this.ctx.fill();
              this.ctx.restore();
            }
          }
        },
        B: {
          width: 2.3,
          render: () => {
            for(let i = 0; i < 2; i++) {
              this.ctx.fillStyle = '#00ffc6';
              this.ctx.save();
              const shadowSize = 0.05;
              if(i == 0) {
                this.ctx.translate(shadowSize, shadowSize * 3);
                this.ctx.fillStyle = '#1232ff';
              }
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
              this.ctx.restore();
            }
          }
        },
        O: {
          width: 2.3,
          render: () => {
            for(let i = 0; i < 2; i++) {
              this.ctx.fillStyle = '#00ffc6';
              this.ctx.save();
              const shadowSize = 0.05;
              if(i == 0) {
                this.ctx.translate(shadowSize, shadowSize * 3);
                this.ctx.fillStyle = '#1232ff';
              }
              const r = 1;
              this.ctx.beginPath();
              this.ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2);
              this.ctx.fill();
              this.ctx.restore();
            }
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
          this.ctx.fillStyle = '#ff00ea';
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
        const word = 'MR.DOOB';
        let totalWidth = 0;
        for(let letter of word) {
          if(letter in this.alphabet) {
            totalWidth += this.alphabet[letter].width;
          }
        }

        this.ctx.translate(-totalWidth / 2, 0);
    
        for(let letter of word) {
          if(letter in this.alphabet) {
            this.alphabet[letter].render();
            this.ctx.translate(this.alphabet[letter].width, 0);
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
