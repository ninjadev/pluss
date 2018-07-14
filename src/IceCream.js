(function(global) {
  class IceCream extends NIN.THREENode {
    constructor(id, options) {
      options.inputs = {
        TestShader: new NIN.TextureInput(),
        CircleShader: new NIN.TextureInput(),
        IceShader: new NIN.TextureInput(),
        squiggleBackground: new NIN.TextureInput(),
      };
      options.outputs = { render: new NIN.TextureOutput() };
      super(id, options);
      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      });
      this.resize();
      // no longer SO
      this.remap = function (value, imin, imax, omin, omax)
      {
        const scale = (omax - omin)/(imax-imin);
        return (value- imin)*scale + omin;

      }
      /*TODO:
       * 1: rig balls to triangle and on top
       *    pink  3616
       *    white 3640
       *    black 3650
       *  should move from each other and then together
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
        container.plane = new THREE.Mesh(new THREE.PlaneGeometry(11,11,32), material);
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
      this.createIceSphere(this.cones.white_cone, {color:0x7AF0CE, side:THREE.DoubleSide}, 
                           this.patternMaterial,[8,0,0], 
                           5, this.scene);
      this.cones.pink_cone = {};
      this.createIceSphere(this.cones.pink_cone, {color:0xffa6bd, side:THREE.DoubleSide}, 
                           this.patternMaterial,[0,0,0], 
                           5, this.scene);
      this.cones.brown_cone = {};
      this.createIceSphere(this.cones.brown_cone, {color:0xFFFC00, side:THREE.DoubleSide}, 
                           this.patternMaterial,[4,8,0], 
                           5, this.scene);
      this.cones.white_cone.plane.material.map = this.inputs.TestShader.getValue();
      this.cylinderGeometry = new THREE.CylinderGeometry( 5, 0, 20, 64 );
      this.cylinderMaterial = new THREE.MeshBasicMaterial( {color: 0xEE7600} );
      this.cylinder = new THREE.Mesh( this.cylinderGeometry, this.cylinderMaterial );
      this.scene.add(this.cylinder);
      this.cylinder.position.x = 6;
      this.cylinder.position.y = -17;
      this.cylinder.position.z = 20;
      //light.position.set(50, 50, 50);
      //this.scene.add(light);
      this.camera.position.set(0,0,-50);
      //this.camera.lookAt = new THREE.Vector3(-1.7,11.98,-5.35);
      this.camera.lookAt(this.cones.white_cone.mesh.position);
      this.positionUpdater = function(frame)
      {
        // Here we drop down three balls
        if (BEAN < 3600){}
        else if (BEAN < 3616)
        {
          // 3600 = 50, 3616 = 0 step it in  BEAN - X0 = 50, x0=  
          // 16 -> 0 should map to 50 to zero 
          //console.log((3640 - BEAN)); 
          //console.log("monster debug time");
          //console.log(BEAN - 3600);
          this.cones.pink_cone.mesh.position.y = this.remap((BEAN -3600), 0,16,0,50) - 50; 
          //console.log(this.cones.pink_cone.mesh.position.y);
        }
        else if (BEAN < 3640){
          // 10 -> 0 should map to 50 to 0
          this.cones.white_cone.mesh.position.y = this.remap(BEAN-3616, 0,24,0,50) - 50;
        }
        else if (BEAN < 3650){
          // 10 -> 0 should map to 50 to 0
          this.cones.brown_cone.mesh.position.y = this.remap(BEAN-3640, 0,10, 0, 50) - 50;
        }
        // Fuck around
        // Drop some more
        // Fuck around
        // TREE TIME
      };

      // Setup background
      {
        const scale = 10;
        const backgroundMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(16*scale, 9*scale, 0),
        );
        backgroundMesh.position.z = 0;

        this.scene.add(backgroundMesh);
        this.backgroundMesh = backgroundMesh;
      }
    }

    update(frame) {

      /* Position updates*/
      const disp1 = new THREE.Vector3(   0, -10, 0);
      const disp2 = new THREE.Vector3( -10,  10, 0);
      const disp3 = new THREE.Vector3(  10,  10, 0);

      const trgt1 = new THREE.Vector3(8,0,0);
      const trgt2 = new THREE.Vector3(0,0,0);
      const trgt3 = new THREE.Vector3(4,8,0);

      // TODO: Animate these over time down to 0
      const localtime = BEAN - 3600;
      const duration = 100;
      const disp_fact = easeIn(1, 0, localtime/duration);  // 1 - ease_out ?
      const rot_fact  = easeOut(1, 0, localtime/duration);  // smoothstep - smoothstep ?

      const rots = 10.0;  // in rads
      const rotvec = new THREE.Vector3(0,0,1);

      const pos1 = trgt1.add(disp1.multiplyScalar(disp_fact)).applyAxisAngle(rotvec, rots*rot_fact);
      const pos2 = trgt2.add(disp2.multiplyScalar(disp_fact)).applyAxisAngle(rotvec, rots*rot_fact);
      const pos3 = trgt3.add(disp3.multiplyScalar(disp_fact)).applyAxisAngle(rotvec, rots*rot_fact);

      // Rotate around y-axis
      if (localtime > 120) {
        const rotvec = new THREE.Vector3(0,1,0);
        const rot = (localtime - 120) / 20.0;
        pos1.applyAxisAngle(rotvec, rot);
        pos2.applyAxisAngle(rotvec, rot);
        pos3.applyAxisAngle(rotvec, rot);
      }

      // Rotate around y-axis
      if (localtime > 150) {
        const rotvec = new THREE.Vector3(1,0,0);
        const rot = (localtime - 150) / 20.0;
        pos1.applyAxisAngle(rotvec, rot);
        pos2.applyAxisAngle(rotvec, rot);
        pos3.applyAxisAngle(rotvec, rot);
      }

      // Set positions
      this.cones.white_cone.mesh.position.set(pos1.x, pos1.y, pos1.z);
      this.cones.brown_cone.mesh.position.set(pos3.x, pos3.y, pos3.z);
      this.cones.pink_cone.mesh.position.set(pos2.x, pos2.y, pos2.z);


      // Add hairs to balls
      {
        this.planeUpdater(this.cones.white_cone, this.camera, this.inputs.IceShader);
        this.planeUpdater(this.cones.pink_cone, this.camera, this.inputs.CircleShader);
        this.planeUpdater(this.cones.brown_cone, this.camera, this.inputs.TestShader); 
        //this.camera.lookAt.set() = new THREE.Vector3(0.88,1.16,-5.01);
        //this.camera.position.x = 30* Math.sin(frame/100)+ 40; 
        //this.camera.position.z = 30* Math.cos(frame/100);
        //this.camera.position.y = 30;
        //this.camera.lookAt(this.cones.white_cone.mesh.position);
      }
 
      this.camera.lookAt(new THREE.Vector3(0,0,0));

      // Update background
      {
        const camera_normal = this.camera.getWorldDirection();
        this.backgroundMesh.position.x = this.camera.position.x + camera_normal.x*100;
        this.backgroundMesh.position.y = this.camera.position.y + camera_normal.y*100;
        this.backgroundMesh.position.z = this.camera.position.z + camera_normal.z*100;
        this.backgroundMesh.lookAt(this.camera.position);
        this.backgroundMesh.material = new THREE.MeshBasicMaterial({
          map: this.inputs.squiggleBackground.getValue(),
        });
      }


      super.update(frame);
    }
  }
  global.IceCream = IceCream;
})(this);
