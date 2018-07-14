(function(global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));
  class zentangleVision extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

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

      var flat_material_1 = new THREE.MeshBasicMaterial({color: 0x3de8ff});
      var flat_material_2 = new THREE.MeshBasicMaterial({color: 0xff0094});
      var flat_material_3 = new THREE.MeshBasicMaterial({color: 0x71ff51});
      var flat_material_4 = new THREE.MeshBasicMaterial({color: 0xfffd00});

      loadObject('res/1.obj', flat_material_1, this.number1_raw );
      loadObject('res/2.obj', flat_material_2, this.number2_raw );
      loadObject('res/3.obj', flat_material_3, this.number3_raw );
      loadObject('res/4.obj', flat_material_4, this.number4_raw );

      this.oneShoutBean     = 4462;
      this.twoShoutBean     = 4476;
      this.threeShoutBean   = 4490;
      this.fourShoutBean    = 4500;
      this.ShoutingOverBean = 4512;

      this.number1 = new THREE.Object3D();
      this.number2 = new THREE.Object3D();
      this.number3 = new THREE.Object3D();
      this.number4 = new THREE.Object3D();

      this.number1.add(this.number1_raw);
      this.number2.add(this.number2_raw);
      this.number3.add(this.number3_raw);
      this.number4.add(this.number4_raw);

      // Resize the numbers:
      this.number1.scale.multiplyScalar(1.9);
      this.number2.scale.multiplyScalar(1.9);
      this.number3.scale.multiplyScalar(1.9);
      this.number4.scale.multiplyScalar(1.9);

      // These correct the raw connections
      this.number1_raw.position.x = 0.6 * GU;
      this.number2_raw.position.x = 0 * GU;
      this.number3_raw.position.x = -0.6 * GU;
      this.number4_raw.position.x = -1.2 * GU;

      this.originVector = new THREE.Vector3(0,0,0);
      this.number1originalPosition = new THREE.Vector3(1.25 * GU, -0.2 * GU, this.number1.position.z);
      this.number2originalPosition = new THREE.Vector3(0 * GU, 0.3 * GU, this.number2.position.z);
      this.number3originalPosition = new THREE.Vector3(-1.25 * GU, -0.3 * GU, this.number3.position.z);
      this.number4originalPosition = new THREE.Vector3(0 * GU, -0.8 * GU, this.number4.position.z);

      // Final x/y posotions:
      this.number1.position.x = this.number1originalPosition.x;
      this.number2.position.x = this.number2originalPosition.x;
      this.number3.position.x = this.number3originalPosition.x;
      this.number4.position.x = this.number4originalPosition.x;

      this.number1.position.y = this.number1originalPosition.y;
      this.number2.position.y = this.number2originalPosition.y;
      this.number3.position.y = this.number3originalPosition.y;
      this.number4.position.y = this.number4originalPosition.y;
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;

      // Remove when jumping to earlier to make debugging easier
      if(BEAN < this.oneShoutBean){
        this.number1.position.x = this.number1originalPosition.x;
        this.number2.position.x = this.number2originalPosition.x;
        this.number3.position.x = this.number3originalPosition.x;
        this.number4.position.x = this.number4originalPosition.x;

        this.number1.position.y = this.number1originalPosition.y;
        this.number2.position.y = this.number2originalPosition.y;
        this.number3.position.y = this.number3originalPosition.y;
        this.number4.position.y = this.number4originalPosition.y;
        this.scene.remove(this.number1);
        this.scene.remove(this.number2);
        this.scene.remove(this.number3);
        this.scene.remove(this.number4);
      }

      // Region from oneShoutBean up to fourShoutBean where we add the numbers:
      if(this.oneShoutBean < BEAN && BEAN < this.fourShoutBean){
        let number1Pos = getPositionForGivenBeanWhenMovingBetwennTwoPoints(this.oneShoutBean, this.fourShoutBean, this.originVector, this.number1originalPosition, BEAN);
        this.number1.position.x = number1Pos.x;
        this.number1.position.y = number1Pos.y;
        this.scene.add(this.number1);
      }
      if(this.twoShoutBean < BEAN && BEAN < this.fourShoutBean){
        let number2Pos = getPositionForGivenBeanWhenMovingBetwennTwoPoints(this.twoShoutBean, this.fourShoutBean, this.originVector, this.number2originalPosition, BEAN);
        this.number2.position.x = number2Pos.x;
        this.number2.position.y = number2Pos.y;
        this.scene.add(this.number2);
      }
      // number3 slide:
      if(this.threeShoutBean < BEAN && BEAN < this.fourShoutBean){
        let number3Pos = getPositionForGivenBeanWhenMovingBetwennTwoPoints(this.threeShoutBean, this.fourShoutBean, this.originVector, this.number3originalPosition, BEAN);
        this.number3.position.x = number3Pos.x;
        this.number3.position.y = number3Pos.y;
        this.scene.add(this.number3);
      }
      if(BEAN == this.fourShoutBean){
        this.scene.add(this.number4);
      }
      // Region add numbers end

      const heighter = 12.8;
      this.number1.position.x = -45;
      this.number1.position.y = -heighter;
      this.number2.position.x = -25;
      this.number2.position.y = -heighter - 5;
      this.number3.position.x = -2;
      this.number3.position.y = -heighter + 3;
      this.number4.position.x = 25;
      this.number4.position.y = -heighter;

      // Region add rotation aboutself
      this.number1.rotation.y = easeOut(
        Math.PI / 2, 0, Math.pow(F(this.frame, 4464, 24), 0.5));
      this.number2.rotation.y = easeOut(
        Math.PI / 2, 0, Math.pow(F(this.frame, 4464 + 12, 24), 0.5));
      this.number3.rotation.y = easeOut(
        Math.PI / 2, 0, Math.pow(F(this.frame, 4464 + 24, 24), 0.5));
      this.number4.rotation.y = easeOut(
        Math.PI / 2, 0, Math.pow(F(this.frame, 4464 + 36, 24), 0.5));
      // End region rotate about self
    } // End update()
  }

  function getPositionForGivenBeanWhenMovingBetwennTwoPoints(startBean, endBean, startPositionVector3, endPositionVector3, currentBean) {
    // Get the inverse of the starting position so that we can subtract it from the final position:
    let startPosition = new THREE.Vector3(0,0,0);
    startPosition.copy(startPositionVector3);
    startPosition.negate();
    let startToEnd = new THREE.Vector3(0,0,0);
    startToEnd.addVectors(endPositionVector3,startPosition);

    let beanInterval = endBean - startBean;
    let howFarWeAreAlong = currentBean - startBean;
    let fractionIn = howFarWeAreAlong / beanInterval;

    startToEnd.multiplyScalar(fractionIn);
    let resultingPosition = new THREE.Vector3(0,0,0);
    resultingPosition.addVectors(startPositionVector3, startToEnd);
    return resultingPosition;
  }

  global.zentangleVision = zentangleVision;
})(this);
