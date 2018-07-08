(function(global) {
  class dimension1 extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput(),
          depth: new NIN.TextureOutput(),
        }
      });

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40) ,new THREE.MeshPhongMaterial({ color: 0xFF256F }));
      this.scene.add(this.cube);

      this.bg = new THREE.Mesh(new THREE.BoxGeometry(221, 124, 0.0001),
                                 new THREE.MeshPhongMaterial({ color: 0x666666 })); // A background of max size ish. Useful to know how large that would be :)
      this.bg.position.z = -49; // just within the cameras view
      this.scene.add(this.bg);

      var light = new THREE.PointLight(0xffffff, 1, 500);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      var light2 = new THREE.PointLight(0x777777, 1, 500);
      light2.position.set(-50, -50, 50);
      this.scene.add(light2);

      this.camera2 = new THREE.PerspectiveCamera( 45, 16 / 9, 50, 150 );
      this.camera2.position.z = 100;

      this.targetDepthTexture = new THREE.DepthTexture();
      this.renderTarget.depthTexture = this.targetDepthTexture;
      this.renderTarget.depthTexture.type = THREE.UnsignedShortType;
    }

    update(frame) {
      super.update(frame);

      this.cube.rotation.x = Math.sin(frame / 20);
      this.cube.rotation.y = -Math.cos(frame / 20) + 3;
    }

    render(renderer) {
      renderer.render(this.scene, this.camera2, this.renderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
      this.outputs.depth.setValue(this.renderTarget.depthTexture);
    }
  }

  global.dimension1 = dimension1;
})(this);
