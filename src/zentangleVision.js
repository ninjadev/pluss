(function(global) {
  class zentangleVision extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5),
                                 new THREE.MeshBasicMaterial({ color: 0x444444 }));
      this.scene.add(this.cube);

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 100;

      this.bg = new THREE.Mesh(new THREE.BoxGeometry(221, 124, 0.0001),
                                 new THREE.MeshBasicMaterial({ color: 0x666666 })); // A background of max size ish. Useful to know how large that would be :)
      this.bg.position.z = -49; // just within the cameras view
      this.scene.add(this.bg);

      for (var i = 0; i < 10; i++)
      {
        for (var j = 0; j < 10; j++)
        {
          var cube = new THREE.Mesh(new THREE.BoxGeometry(4 + 4 * Math.random(), 4 + 4 * Math.random(), 4 + 4 * Math.random()),
                                     new THREE.MeshBasicMaterial({ color: 0x6F256F }));
          cube.material.color.r = Math.random() * 0.5 + 0.45;
          cube.material.color.g = Math.random() * 0.5 + 0.45;
          cube.material.color.b = Math.random() * 0.5 + 0.45;
          cube.position.x = - 50 + i * 10;
          cube.position.z = - 80 + j * 20;
          cube.position.y = Math.random() * 3 - j * 3 ;
          this.scene.add(cube);
        }
      }
    }

    update(frame) {
      super.update(frame);

      this.cube.rotation.x = Math.sin(frame / 10);
      this.cube.rotation.y = Math.cos(frame / 10);
    }
  }

  global.zentangleVision = zentangleVision;
})(this);
