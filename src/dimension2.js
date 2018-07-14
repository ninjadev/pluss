(function(global) {
  class dimension2 extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput(),
          depth: new NIN.TextureOutput(),
        }
      });

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(35, 10, 28),new THREE.MeshPhongMaterial({ color: 0xFF256F }));
      this.scene.add(this.cube);

      this.bg = new THREE.Mesh(new THREE.BoxGeometry(221, 124, 0.0001),
                                 new THREE.MeshPhongMaterial({ color: 0x666666 })); // A background of max size ish. Useful to know how large that would be :)
      this.bg.position.z = -49; // just within the cameras view
      //this.scene.add(this.bg);

      var light = new THREE.PointLight(0xffffff, 1, 500);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      var light2 = new THREE.PointLight(0x777777, 1, 500);
      light2.position.set(-50, -50, 50);
      this.scene.add(light2);

      this.camera2 = new THREE.PerspectiveCamera( 45, 16 / 9, 50, 450 );
      this.camera2.position.z = 100;

      this.targetDepthTexture = new THREE.DepthTexture();
      this.renderTarget.depthTexture = this.targetDepthTexture;
      this.renderTarget.depthTexture.type = THREE.UnsignedShortType;
    }

    update(frame) {
      super.update(frame);

      var vm_rotation_x =  0.7 * Math.sin(frame / 20) + Math.PI / 2;
      var vm_rotation_y = 0.4 * -Math.cos(frame / 20);

      this.cube.rotation.x = vm_rotation_x;
      this.cube.rotation.y = vm_rotation_y;

      this.cube.position.y = 1000;

      var start_obj_bounce = 5250;
      var end_obj_bounce = 5300;
      if (frame > start_obj_bounce && frame < end_obj_bounce)
      {
        this.cube.position.y = 0.03 * (frame - end_obj_bounce) * GU * Math.sin(frame / Math.PI);
        this.cube.position.x = -(frame - end_obj_bounce) * 2;
      }
      else if ( frame > end_obj_bounce)
      {
        this.cube.position.x = 0;
        this.cube.position.y = -6;
      }
      if (frame < start_obj_bounce)
      {
        this.cube.position.y = 1000;
      }
      else if (frame > start_obj_bounce && frame < end_obj_bounce)
      {
        this.cube.position.y = 0.03 * (frame - end_obj_bounce) * GU * Math.sin(frame / Math.PI);
        this.cube.position.x = (frame - end_obj_bounce) * 2;
      }


    }

    render(renderer) {
      renderer.render(this.scene, this.camera2, this.renderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
      this.outputs.depth.setValue(this.renderTarget.depthTexture);
    }
  }

  global.dimension2 = dimension2;
})(this);
