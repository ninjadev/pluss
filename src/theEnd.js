(function(global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));
  class theEnd extends NIN.THREENode {
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

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

      this.cameraX = 0;
      this.cameraY = 0;
      this.cameraDX = 0;
      this.cameraDY = 0;
      this.cameraDDX = 0;
      this.cameraDDY = 0;

      var light = new THREE.PointLight( 0xffffff, 1, 100 );
      light.position.set( -50, -50, -50 );
      this.scene.add(light);

      var pointLight = new THREE.PointLight(0xFFFFFF);
      pointLight.position.x = 10;
      pointLight.position.y = 50;
      pointLight.position.z = 130;
      this.scene.add(pointLight);

      this.camera.position.z = 100;
      this.frame = 0;
      this.color = '#74fbc9';
      this.shadow = '#000000';
      this.blank = 'rgba(0,0,0,0)';
      this.initiate();
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;
      let startBEAN = 113 * 12 * 4;
      let startFrame = FRAME_FOR_BEAN(startBEAN);
      let nin = 5568;
      let ja = 5586;
      let dev = 5604;
      let t = 0;
      if (BEAN >= nin) {
        t = frame - FRAME_FOR_BEAN(nin);
        this.sizeNIN = lerp(0.5, 1.5, t/10);
      }
      if (BEAN >= ja) {
        t = frame - FRAME_FOR_BEAN(ja);
        this.sizeJA = lerp(0.5, 1.5, t/10);
      }
      if (BEAN >= dev) {
        t = frame - FRAME_FOR_BEAN(dev);
        this.sizeDEV = lerp(0.5, 1.5, t/10);
      }

      if (frame < FRAME_FOR_BEAN(startBEAN) + 1) {
        this.initiate();
      }
      if (BEAT) {
        if (BEAN == nin) {
          this.colorNIN = this.color;
          this.shadowNIN = this.shadow;
        }
        if (BEAN == ja) {
          this.colorJA = this.color;
          this.shadowJA = this.shadow;
        }
        if (BEAN == dev) {
          this.colorDEV = this.color;
          this.shadowDEV = this.shadow;
        }
      }

      if (BEAN > dev + 48 * 2 + 24) {
        this.colorNIN = this.blank;
        this.colorJA = this.blank;
        this.colorDEV = this.blank;
        this.shadowNIN = this.blank;
        this.shadowJA = this.blank;
        this.shadowDEV = this.blank;
      }

      this.rotator = smoothstep(0, -.2, (frame - FRAME_FOR_BEAN(12 * 4 * 114)) / 200);

      this.cameraDDX += -this.cameraDX * 0.9 + (Math.random() - 0.5) * smoothstep(0, 1, (frame-startFrame)/100)/4;
      this.cameraDDY += -this.cameraDY * 0.9 + (Math.random() - 0.5) * smoothstep(0, 1, (frame-startFrame)/100)/4;
      this.cameraDX = - this.cameraX * 0.5;
      this.cameraDY = - this.cameraY * 0.5;
      this.cameraDX *= 0.5;
      this.cameraDY *= 0.5;
      this.cameraDX += this.cameraDDX;
      this.cameraDY += this.cameraDDY;
      this.cameraX += this.cameraDX;
      this.cameraY += this.cameraDY;
      this.cameraX *= 0.5;
      this.cameraY *= 0.5;
    }

    resize() {
      super.resize();
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      let font = 'lemonmilkbold';
      let size = 1.2;
      let shake = 0.4;
      this.ctx.font = 'bold ' + (size * GU) + `pt ${font}`;
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = this.bgcolor;
      this.ctx.fillRect(0, 0, 16*GU, 9*GU);
      this.ctx.save();

      this.ctx.translate(8*GU, 4.5*GU);
      this.ctx.scale(this.sizeNIN, this.sizeNIN);
      this.ctx.translate(-8*GU, -4.5*GU);
      this.ctx.translate(this.cameraX * GU * shake, this.cameraY * GU * shake);

      this.ctx.fillStyle = this.shadowNIN;
      this.ctx.fillText('NIN', 3.8 * GU, 4.6 * GU);
      this.ctx.fillStyle = this.colorNIN;
      this.ctx.fillText('NIN', 3.7 * GU, 4.5 * GU);

      this.ctx.restore();
      this.ctx.save();
      
      this.ctx.translate(8*GU, 4.5*GU);
      this.ctx.scale(this.sizeJA, this.sizeJA);
      this.ctx.translate(-8*GU, -4.5*GU);
      this.ctx.translate(this.cameraX * GU * shake, this.cameraY * GU * shake);

      this.ctx.fillStyle = this.shadowJA;
      this.ctx.fillText('JA', 6.8 * GU, 4.6 * GU);
      this.ctx.fillStyle = this.colorJA;
      this.ctx.fillText('JA', 6.7 * GU, 4.5 * GU);

      this.ctx.restore();
      this.ctx.save();
      
      this.ctx.translate(8*GU, 4.5*GU);
      this.ctx.scale(this.sizeDEV, this.sizeDEV);
      this.ctx.translate(-8*GU, -4.5*GU);
      this.ctx.translate(this.cameraX * GU * shake, this.cameraY * GU * shake);

      this.ctx.fillStyle = this.shadowDEV;
      this.ctx.fillText('DEV', 9.0 * GU, 4.6 * GU);
      this.ctx.fillStyle = this.colorDEV;
      this.ctx.fillText('DEV', 8.9 * GU, 4.5 * GU);

      this.ctx.restore();

      if(BEAN >= 5712) {
        this.ctx.save();
        this.ctx.fillStyle = 'black';
        this.ctx.globalAlpha = easeOut(0, 1, F(this.frame, 5712, 12));
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
      }

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    initiate() {
      this.bgcolor = this.blank;
      this.colorNIN = this.blank;
      this.colorJA = this.blank;
      this.colorDEV = this.blank;
      this.shadowNIN = this.blank;
      this.shadowJA = this.blank;
      this.shadowDEV = this.blank;
      this.sizer = 1;
    }
  }

  global.theEnd = theEnd;
})(this);
