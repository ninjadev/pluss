(function(global) {

  const FFB = FRAME_FOR_BEAN;

  class ninjadevtext extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');

      const gradientResolution = 16;
      const gradient = this.ctx.createLinearGradient(0, 0, gradientResolution, 0);
      gradient.addColorStop(0, '#d46ce7');
      gradient.addColorStop(1, '#e9f259');
      this.canvas.width = gradientResolution;
      this.canvas.height = 1;
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, gradientResolution, 1);
      const data = this.ctx.getImageData(0, 0, gradientResolution, 1).data;
      this.gradient = [];
      function hex(num) {
        return ('0' + num.toString(16)).slice(-2);

      }
      for(let i = 0; i < gradientResolution; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        this.gradient.push('#' + hex(r) + hex(g) + hex(b));
        this.gradient.unshift('#' + hex(r) + hex(g) + hex(b));
      }

      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
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
      this.ctx.fillStyle = '#7cf3d3';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = '1.5pt lemonmilkbold';
      let offset = -1 / 5;
      if(BEAN >= 2014) {
        this.ctx.font = '1pt lemonmilkbold';
      }
      this.ctx.fillStyle = 'white';
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 0.05;
      const startTimer = (this.frame - FFB(1908 + 48)) / (FFB(1920 + 48) - FFB(1908 + 48));

      this.ctx.translate(7 + offset, 4 + offset);

      const rounds = 30;
      const rotationTimer = (this.frame - FFB(1956 + 48)) / (FFB(1968 + 48) - FFB(1956 + 48));
      const rotation = easeIn(Math.PI / 16, -Math.PI, rotationTimer);
      this.ctx.translate(
          easeIn(0, 1 - offset, rotationTimer),
          easeIn(0, 0.5 - offset, rotationTimer));
      this.ctx.translate(-(rounds + 1) * offset, -(rounds + 1) * offset);
      const roundsTarget = 
        smoothstep(
          easeIn(rounds, 0, startTimer),
          rounds / 2,
          rotationTimer * 2) - easeIn(0, rounds / 2, rotationTimer);
      for(let i = rounds; i >= roundsTarget; i--) {
        this.ctx.translate(offset, offset);
        const shakeTimer = (i - this.frame) / 60 / 60 * 190 * Math.PI * 2 * 2;
        this.ctx.translate(
            easeIn(0.1, 0, rotationTimer) / i * Math.sin(shakeTimer),
            easeIn(0.1, 0, rotationTimer) / i * Math.cos(shakeTimer)
            );
        this.ctx.save();
        this.ctx.rotate(-rotation); 
        this.ctx.fillStyle = this.gradient[((999999 * this.gradient.length + i - this.frame) | 0) % this.gradient.length];
        if(i - 1 < roundsTarget) {
          this.ctx.fillStyle = 'white';
        }
        let word = easeIn(0, 1, rotationTimer) < 0.5 ? 'Ninjadev' : 'Back';
        if(word === 'Ninjadev') {
          word = word.slice(
            0, easeOut(word.length, 0, rotationTimer - 0.5));
        }
        if(BEAN >= 1968 + 0 + 48) {
          word += '';
        }
        if(BEAN >= 1968 + 12 + 6 + 48) {
          word += ' in';
        }
        if(BEAN >= 1968 + 24 + 12 + 48) {
          word += ' style';
        }
        if(easeIn(0, 1, rotationTimer) >= 0.5) {
          this.ctx.rotate(Math.PI);
        }
        this.ctx.fillText(word, 0 , 0);
        //this.ctx.strokeText(word, 0 , 0);
        this.ctx.restore();
      }

      this.ctx.restore();



      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.ninjadevtext = ninjadevtext;
})(this);
