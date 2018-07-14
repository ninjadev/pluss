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

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40) ,new THREE.MeshPhongMaterial({ color: 0xF625FF }));
      //this.scene.add(this.cube);

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

      this.vm_body = new THREE.Object3D();
      var vm_body_material = new THREE.MeshPhongMaterial({color: 0xD72921});
      loadObject('res/vm_body.obj', vm_body_material, this.vm_body );
      this.scene.add( this.vm_body );

      this.vm_disc = new THREE.Object3D();
      var vm_disc_material = new THREE.MeshPhongMaterial({color: 0xE3F4D0});
      loadObject('res/vm_disc.obj', vm_disc_material, this.vm_disc );
      this.scene.add( this.vm_disc );

      this.vm_arm = new THREE.Object3D();
      var vm_arm_material = new THREE.MeshPhongMaterial({color: 0x203020});
      loadObject('res/vm_arm.obj', vm_arm_material, this.vm_arm );
      this.scene.add( this.vm_arm );

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

      var vm_scale = 5;
      var vm_rotation_x =  0.7 * Math.sin(frame / 20) + Math.PI / 2;
      var vm_rotation_y = 0.4 * -Math.cos(frame / 20);
      var vm_rotation_z = 0;
      var vm_position_x = 0;
      var vm_position_y = -6;
      var vm_position_z = 15;

      if (frame < 5290) {
        vm_position_x = 1000;
      }

      this.vm_arm.rotation.x = vm_rotation_x;
      this.vm_body.rotation.x = vm_rotation_x;
      this.vm_disc.rotation.x = vm_rotation_x;
      this.vm_arm.rotation.y = vm_rotation_y;
      this.vm_body.rotation.y = vm_rotation_y;
      this.vm_disc.rotation.y = vm_rotation_y;
      this.vm_arm.rotation.z = vm_rotation_z;
      this.vm_body.rotation.z = vm_rotation_z;
      this.vm_disc.rotation.z = vm_rotation_z;

      this.vm_arm.position.x = vm_position_x;
      this.vm_body.position.x = vm_position_x;
      this.vm_disc.position.x = vm_position_x;
      this.vm_arm.position.y = vm_position_y;
      this.vm_body.position.y = vm_position_y;
      this.vm_disc.position.y = vm_position_y;
      this.vm_arm.position.z = vm_position_z;
      this.vm_body.position.z = vm_position_z;
      this.vm_disc.position.z = vm_position_z;

      this.vm_body.scale.x = vm_scale;
      this.vm_body.scale.y = vm_scale;
      this.vm_body.scale.z = vm_scale;
      this.vm_disc.scale.x = vm_scale;
      this.vm_disc.scale.y = vm_scale;
      this.vm_disc.scale.z = vm_scale;
      this.vm_arm.scale.x = vm_scale;
      this.vm_arm.scale.y = vm_scale;
      this.vm_arm.scale.z = vm_scale;


    }

    render(renderer) {
      renderer.render(this.scene, this.camera2, this.renderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
      this.outputs.depth.setValue(this.renderTarget.depthTexture);
    }
  }

  global.dimension1 = dimension1;
})(this);
