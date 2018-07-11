(function(global) {
  class dimensionBackground extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput(),
          depth: new NIN.TextureOutput(),
        }
      });

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5),new THREE.MeshPhongMaterial({ color: 0x6F256F }));
      //this.scene.add(this.cube);
      this.cube2 = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5),new THREE.MeshPhongMaterial({ color: 0x530E53 }));
      this.cube2.position.set(30, 20, 0);
      //this.scene.add(this.cube2);
      this.cube3 = new THREE.Mesh(new THREE.BoxGeometry(30, 5, 5),new THREE.MeshPhongMaterial({ color: 0x8A458A }));
      this.cube3.position.set(-30, 30, 0);
      //this.scene.add(this.cube3);

      this.dimentionlens_model = new THREE.Object3D();
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

      var bestMaterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF});

      loadObject('res/dimentionlens.obj', bestMaterial, this.dimentionlens_model );
      this.scene.add( this.dimentionlens_model );
      this.dimentionlens_model.scale.x = 14;
      this.dimentionlens_model.scale.y = 14;
      this.dimentionlens_model.scale.z = 14;

      this.stage_model = new THREE.Object3D();
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

      var bestMaterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF});

      loadObject('res/stage.obj', bestMaterial, this.stage_model );
      this.scene.add( this.stage_model );
      this.stage_model.scale.x = 18;
      this.stage_model.scale.y = 18;
      this.stage_model.scale.z = 18;
      this.stage_model.position.y = -12;
      this.stage_model.position.z = 100;
      this.stage_model.rotation.x = Math.PI / 2 * 0.37;
      this.stage_model.position.y = -19;
      this.stage_model.position.z = -60;

      this.bg = new THREE.Mesh(new THREE.BoxGeometry(221, 124, 0.0001),
                                 new THREE.MeshPhongMaterial({ color: 0x666666 })); // A background of max size ish. Useful to know how large that would be :)
      this.bg.position.z = -49; // just within the cameras view
      //this.scene.add(this.bg);

      for (var i = 0; i < 60; i++)
      {
        for (var j = 0; j < 30; j++)
        {
          var cube = new THREE.Mesh(new THREE.BoxGeometry(2 + 2 * Math.random(), 2 + 2 * Math.random(), 2 + 2 * Math.random()),
                                     new THREE.MeshPhongMaterial({ color: 0x6F256F }));
          cube.position.x = - 120 + i * 4;
          cube.position.z = - 60 + j * 4;
          cube.position.y = Math.random() * 3 - j;
          //this.scene.add(cube);
        }
      }


      var light = new THREE.PointLight(0xffffff, 1, 500);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera2 = new THREE.PerspectiveCamera( 45, 16 / 9, 50, 450 );
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

      this.dimentionlens_model.position.x = 0.35 * 80 * Math.sin(frame / 30);
      this.dimentionlens_model.position.y = 0;
      this.dimentionlens_model.position.z = 15;
      this.dimentionlens_model.rotation.y = frame / 20;

    }

    render(renderer) {
      renderer.render(this.scene, this.camera2, this.renderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
      this.outputs.depth.setValue(this.renderTarget.depthTexture);
    }
  }

  global.dimensionBackground = dimensionBackground;
})(this);
