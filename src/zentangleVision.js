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
                               new THREE.MeshBasicMaterial({ color: 0x111111 })); // A background of max size ish. Useful to know how large that would be :)
      this.bg.position.z = -49; // just within the cameras view
      this.scene.add(this.bg);

      this.number1_raw = new THREE.Object3D();
      this.number2_raw = new THREE.Object3D();
      this.number3_raw = new THREE.Object3D();
      this.number4_raw = new THREE.Object3D();
      var loadObject = function (objPath, material, three_object) {
        var objLoader = new THREE.OBJLoader();
        Loader.loadAjax(objPath, function(text) {
          var object = objLoader.parse(text);
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              child.material = material;
              child.material.side = THREE.DoubleSide;
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          three_object.add(object);
        });
      };

      var flat_material_1 = new THREE.MeshBasicMaterial({color: 0x999999});
      var flat_material_2 = new THREE.MeshBasicMaterial({color: 0xEEEEEE});
      var flat_material_3 = new THREE.MeshBasicMaterial({color: 0x555555});
      var flat_material_4 = new THREE.MeshBasicMaterial({color: 0x333333});

      loadObject('res/1.obj', flat_material_1, this.number1_raw );
      loadObject('res/2.obj', flat_material_2, this.number2_raw );
      loadObject('res/3.obj', flat_material_3, this.number3_raw );
      loadObject('res/4.obj', flat_material_4, this.number4_raw );

      this.oneShoutBean = 4462;
      this.twoShoutBean = 4476;
      this.threeShoutBean = 4490;
      this.fourShoutBean = 4500;
      this.ShoutingOverBeab = 4512;

      this.number1 = new THREE.Object3D();
      this.number2 = new THREE.Object3D();
      this.number3 = new THREE.Object3D();
      this.number4 = new THREE.Object3D();

      this.number1.add(this.number1_raw);
      this.number2.add(this.number2_raw);
      this.number3.add(this.number3_raw);
      this.number4.add(this.number4_raw);

      // These correct the raw connections
      this.number1_raw.position.x = 0.6 * GU;
      this.number2_raw.position.x = 0 * GU;
      this.number3_raw.position.x = -0.6 * GU;
      this.number4_raw.position.x = -1.2 * GU;

      // The y translation here ensures that the numbers are not all stacked atop of each other
      this.number1.position.y = 0.5 * GU;
      this.number2.position.y = 0 * GU;
      this.number3.position.y = -0.5 * GU;
      this.number4.position.y = -1 * GU;
    }

    update(frame) {
      super.update(frame);

      // Remove when jumping to earlier to make debugging easier
      if(BEAN < this.oneShoutBean){
        this.scene.remove(this.number1);
        this.scene.remove(this.number2);
        this.scene.remove(this.number3);
        this.scene.remove(this.number4);
      }

      if(BEAN == this.oneShoutBean){
        this.scene.add(this.number1);
      }
      if(BEAN == this.twoShoutBean){
        this.scene.add(this.number2);
      }
      if(BEAN == this.threeShoutBean){
        this.scene.add(this.number3);
      }
      if(BEAN == this.fourShoutBean){
        this.scene.add(this.number4);
      }

      // number3 slide:
      if(this.threeShoutBean < BEAN && BEAN < this.fourShoutBean){
        // debugger;
        let currentStep = BEAN - this.threeShoutBean;
        let totalSteps = this.fourShoutBean - this.threeShoutBean;
        let interval = 2 * GU; // 1.5 - (-1.5)
        let initialPosition = 1 * GU;
        let stepSize = interval/totalSteps;
        this.number3.position.x = initialPosition - (currentStep * stepSize);
      }

      this.cube.rotation.x = Math.sin(frame / 10);
      this.cube.rotation.y = Math.cos(frame / 10);

      this.number1.rotation.y = frame / 10;
      this.number2.rotation.y = frame / 10;
      this.number3.rotation.y = frame / 10;
      this.number4.rotation.y = frame / 10;
    }
  }

  global.zentangleVision = zentangleVision;
})(this);
