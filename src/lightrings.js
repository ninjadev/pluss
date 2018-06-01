(function(global) {
  class lightrings extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.torus1 = new THREE.Mesh(new THREE.TorusGeometry(10, 1, 16, 100), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      this.torus2 = new THREE.Mesh(new THREE.TorusGeometry(20, 1, 16, 100), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      this.torus3 = new THREE.Mesh(new THREE.TorusGeometry(30, 1, 16, 100), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      this.sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      this.scene.add(this.torus1);
      this.scene.add(this.torus2);
      this.scene.add(this.torus3);
      this.scene.add(this.sphere);

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 100;
    }

    update(frame) {
      super.update(frame);

      var speed = frame / 10;
      this.torus1.rotation.set(speed, speed, speed*2);
      this.torus2.rotation.set(speed, speed*2, speed);
      this.torus3.rotation.set(speed*2, speed, speed);
    }
  }

  global.lightrings = lightrings;
})(this);
