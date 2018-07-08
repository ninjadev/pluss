(function(global) {
  class scanner extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput(),
          depth: new NIN.TextureOutput(),
        }
      });

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5),new THREE.MeshPhongMaterial({ color: 0x6F256F }));
      this.scene.add(this.cube);
      this.cube2 = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5),new THREE.MeshPhongMaterial({ color: 0x530E53 }));
      this.cube2.position.set(30, 20, 0);
      this.scene.add(this.cube2);
      this.cube3 = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5),new THREE.MeshPhongMaterial({ color: 0x8A458A }));
      this.cube3.position.set(-30, 30, 0);
      this.scene.add(this.cube3);

      this.bg = new THREE.Mesh(new THREE.BoxGeometry(221, 124, 0.0001),
                                 new THREE.MeshPhongMaterial({ color: 0x666666 })); // A background of max size ish. Useful to know how large that would be :)
      this.bg.position.z = -49; // just within the cameras view
      this.scene.add(this.bg);

      for (var i = 0; i < 60; i++)
      {
        for (var j = 0; j < 30; j++)
        {
          var cube = new THREE.Mesh(new THREE.BoxGeometry(2 + 2 * Math.random(), 2 + 2 * Math.random(), 2 + 2 * Math.random()),
                                     new THREE.MeshPhongMaterial({ color: 0x6F256F }));
          cube.position.x = - 120 + i * 4;
          cube.position.z = - 60 + j * 4;
          cube.position.y = Math.random() * 3 - j;
          this.scene.add(cube);
        }
      }


      var light = new THREE.PointLight(0xffffff, 1, 500);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera2 = new THREE.PerspectiveCamera( 45, 16 / 9, 50, 150 );
      this.camera2.position.z = 100;

      this.targetDepthTexture = new THREE.DepthTexture();
      this.renderTarget.depthTexture = this.targetDepthTexture;
      this.renderTarget.depthTexture.type = THREE.UnsignedShortType;
    }

    update(frame) {
      super.update(frame);

      this.cube.rotation.x = Math.sin(frame / 10);
      this.cube.rotation.y = Math.cos(frame / 10);
      this.cube2.rotation.x = -Math.sin(frame / 10);
      this.cube2.rotation.y = Math.cos(frame / 10);
      this.cube3.rotation.x = Math.sin(frame / 10);
      this.cube3.rotation.y = -Math.cos(frame / 10);
    }

    render(renderer) {
      renderer.render(this.scene, this.camera2, this.renderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
      this.outputs.depth.setValue(this.renderTarget.depthTexture);
    }
  }

  global.scanner = scanner;
})(this);
