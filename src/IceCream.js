(function(global) {
  class IceCream extends NIN.THREENode {
    constructor(id, options) {
      options.inputs = { TestShader: new NIN.TextureInput() };
      options.outputs = { render: new NIN.TextureOutput() };
      super(id, options);
      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      });
      this.resize();
      /*TODO:
       * 1: rig balls to triangle and on top
       *    pink  3616
       *    white 3640
       *    black 3650
       * 2: camera
       * 3: Texturize
       * 4: zoom out and Q rune 
       */
      this.planeUpdater = function (container, camera, inp){
        if (container.kind == "sphere")
        {
          container.plane.position.x = container.mesh.position.x;
          container.plane.position.y = container.mesh.position.y;
          container.plane.position.z = container.mesh.position.z;
          var surface_point_nearest_camera = new THREE.Vector3(camera.position.x - container.mesh.position.x,
                                                               camera.position.y - container.mesh.position.y,
                                                               camera.position.z - container.mesh.position.z);
          surface_point_nearest_camera.normalize();
          container.plane.lookAt(camera.position);
          surface_point_nearest_camera.multiplyScalar(container.radius + 0.01);
          container.plane.position.x = container.mesh.position.x + surface_point_nearest_camera.x ;
          container.plane.position.y = container.mesh.position.y + surface_point_nearest_camera.y ;
          container.plane.position.z = container.mesh.position.z + surface_point_nearest_camera.z ;
          container.plane.material = new THREE.MeshBasicMaterial();
          container.plane.material.map = inp.getValue(); 
          container.plane.material.transparent = true;

        }
      };

      this.createIceSphere = function(container, color, material, position, size, scene){
        container.mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 32), 
                                        new THREE.MeshBasicMaterial(color));
        container.plane = new THREE.Mesh(new THREE.PlaneGeometry(20,20,32), material);
        container.mesh.position.x = position[0];
        container.mesh.position.y = position[1];
        container.mesh.position.z = position[2];
        container.kind = "sphere";
        container.radius = size;
        scene.add(container.mesh);
        scene.add(container.plane);
      };
      this.cones = {};
      this.cones.white_cone = {};
      this.patternMaterial = new THREE.MeshBasicMaterial();
      //this.patternMaterial.transparent = true; 
      this.createIceSphere(this.cones.white_cone, {color:0x888888, side:THREE.DoubleSide}, 
                           this.patternMaterial,[0,0,0], 
                           5, this.scene);
      this.cones.pink_cone = {};
      this.createIceSphere(this.cones.pink_cone, {color:0x881188, side:THREE.DoubleSide}, 
                           this.patternMaterial,[0,50,0], 
                           5, this.scene);
      this.cones.brown_cone = {};
      this.createIceSphere(this.cones.brown_cone, {color:0x8B4513, side:THREE.DoubleSide}, 
                           this.patternMaterial,[10,10,10], 
                           5, this.scene);
      this.cones.white_cone.plane.material.map = this.inputs.TestShader.getValue();

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 50;
      this.positionUpdater = function(frame)
      {
        // Here we drop down three balls
        if (BEAN < 3600){}
        else if (BEAN < 3616)
        {
          // 3600 = 50, 3616 = 0 step it in  BEAN - X0 = 50, x0=  
          this.cones.pink_cone.mesh.position.y = 3640 - BEAN;   
        }
        else if (BEAN < 3640){
          this.cones.white_cone.mesh.position.y = 3650 - BEAN; 
        }
        else if (BEAN < 3650){
          this.cones.brown_cone.mesh.position.y = 3660 - BEAN;
        }
        // Fuck around
        // Drop some more
        // Fuck around
        // TREE TIME
      };
    }

    update(frame) {
      super.update(frame);
      /* Position updates*/
      this.positionUpdater(frame);


      this.planeUpdater(this.cones.white_cone, this.camera, this.inputs.TestShader);
      this.planeUpdater(this.cones.pink_cone, this.camera, this.inputs.TestShader);
      this.planeUpdater(this.cones.brown_cone, this.camera, this.inputs.TestShader); 
      // Alternatively needs update on material
      //this.cones.white_cone.plane.material = new THREE.MeshBasicMaterial();
      //this.cones.white_cone.plane.material.transparent = true;
      //this.cones.white_cone.plane.material.map = this.inputs.TestShader.getValue();
      //console.log(this.cones.white_cone.plane.material.map);
      //this.cones.white_cone.plane.material.map.needsUpdate = true;

      
      //this.camera.position.x = 100* Math.sin(frame/100); 
      //this.camera.position.z = 100* Math.cos(frame/100); 
      this.camera.lookAt(new THREE.Vector3(0,0,0));
    }
  }
  global.IceCream = IceCream;
})(this);
