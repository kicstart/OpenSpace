Ship = function(shipClass){
  this.id = -1;
  this.position = new THREE.Vector3(0,0,0);
  this.velocity = {x:0,y:0,z:0};
  this.angularVelocity = {x:0,y:0,z:0};
  this.mesh = new THREE.Mesh(); 
  this.shipClass = shipClass;
  this.hull = this.shipClass.hull_pts;
  this.type = shipClass.type;
};

Ship.prototype = {
  
  constructor: Ship,

  load: function(callback){
    var loader = new THREE.JSONLoader(true);
    var scope = this;
    var handler = function(geo){
        
        geo.materials[0].shading = THREE.FlatShading;
        // var material = new THREE.MeshFaceMaterial();
        var material = new THREE.MeshPhongMaterial({ // Plastic toy look
          ambient: 0xffffff,
          color: 0x1646ae,
          specular: 0xffffff,
          shininess: 50,
          perPixel: true,
          }
        );
        var nuModel = new THREE.Mesh(geo, material);
        scope.mesh = nuModel;
        scope.mesh.useQuaternion = true;
        scope.mesh.scale.set(0.01,0.01,0.01);
        scope.mesh.quaternion = scope.quaternionFromYawPitchRoll(0, 0, 0);
        scope.mesh.updateMatrix();
        if (callback !== undefined) callback(scope.mesh);
    };
    loader.load(this.shipClass.mesh_url,handler,'obj/'); 
    return this;
  },
  
  animate: function(){
    this.mesh.position.x = this.position.x;
    this.mesh.position.y = this.position.y;
    this.mesh.position.z = this.position.z;
    var yaw, pitch, roll;
    yaw = this.angularVelocity.z;
    pitch = this.angularVelocity.y;
    roll = this.angularVelocity.x;
    this.mesh.quaternion.multiply(
      this.mesh.quaternion,
      this.quaternionFromYawPitchRoll(yaw, pitch, roll));
    this.torpedoCalculations();
    if (orientationTarget != undefined) this.orientation();
  },

  orientationStages: {'CANCEL_':0, 'ALIGN_':1, 'ROTATE_':2},

  currentOrientationStage: 'CANCEL_',

  orientation: function(){
    var aV = this.angularVelocity;
    switch(this.currentOrientationStage){
      case 'CANCEL_':  // cancel current rotation
        if (aV.z != 0){
          if (aV.z < 0){
            socket.emit('ship.thrust', {type:'rollLeft', shipId: shipID});
          } else {
            socket.emit('ship.thrust', {type:'rollRight', shipId: shipID});
          }
        };
        if (aV.x != 0){
          if (aV.x < 0){
            socket.emit('ship.thrust', {type:'pivotLeft', shipId: shipID});
          } else {
            socket.emit('ship.thrust', {type:'pivotRight', shipId: shipID});
          }
        };
        if (aV.y != 0){
          if (aV.y < 0){
            socket.emit('ship.thrust', {type:'noseDown', shipId: shipID});
          } else {
            socket.emit('ship.thrust', {type:'noseUp', shipId: shipID});
          }
        };
        if (Math.abs(aV.x) < 0.00001 && Math.abs(aV.y) < 0.00001 && Math.abs(aV.z) < 0.00001){
          alert('ready for alignment');
          this.currentOrientationStage = 'ALIGN_';
        };
        break;
      case 'ALIGN_':  // align yaw to target
        break;
      case 'ROTATE_': // align pitch to target

        break;
      default:
        break;
    };
  },

  torpedoCalculations: function(){
    var BLASTRADIUS = 20;
    for (tid in myTorpedoes){
      var trp = torpedoes[tid];
      var trg = myTorpedoes[tid].target;
      if(trg != null && trp.distanceTo(trg) <= BLASTRADIUS){
        socket.emit('torpedo.detonate', {torpedoId: tid});
      };
    };
  },
     
  distanceTo: function(target){
    return this.position.distanceTo(target.position); 
  }, 

  quaternionFromYawPitchRoll: function(yaw, pitch, roll){
    var q = new THREE.Quaternion();
    var n1, n2, n3, n4, n5, n6, n7, n8, n9;
    n9 = roll * 0.5;
    n6 = Math.sin(n9);
    n5 = Math.cos(n9);
    n8 = pitch * 0.5;
    n4 = Math.sin(n8);
    n3 = Math.cos(n8);
    n7 = yaw * 0.5;
    n2 = Math.sin(n7);
    n1 = Math.cos(n7);
    q.x = ((n1 * n4) * n5) + ((n2 * n3) * n6);
    q.y = ((n2 * n3) * n5) - ((n1 * n4) * n6);
    q.z = ((n1 * n3) * n6) - ((n2 * n4) * n5);
    q.w = ((n1 * n3) * n5)  + ((n2 * n4) * n6);
    return q;
  },

  getForwardVector: function(){
    var m = this.mesh.matrix;
    return new THREE.Vector3(m.n13,m.n23,m.n33);
  },

  getBackwardVector: function(){
    var b = this.getForwardVector();
    return b.multiplyScalar(-1);
  },

  getUpVector: function(){
    var m = this.mesh.matrix;
    return new THREE.Vector3(m.n12,m.n22,m.n32);
    // return this.mesh.matrix.getColumnY();
  },

  getDownVector: function(){
    var up = this.getUpVector();
    return up.multiplyScalar(-1);
  },

  getRightVector: function(){
    var right = this.getLeftVector();
    return right.multiplyScalar(-1);
  },

  getLeftVector: function(){
    var m = this.mesh.matrix;
    return new THREE.Vector3(m.n11,m.n21,m.n31);
    // return this.mesh.matrix.getColumnX();
  },
};


shipClass = function(name, mesh_url, hull_pts, max_angulars, type){
  this.name = name;
  this.mesh_url = mesh_url;
  this.hull_pts = hull_pts !== undefined ? hull_pts : 100;
  this.max_angulars = max_angulars !== undefined ? max_angulars : {x:0.3, y:0.3, z:0.3};
  this.type = type;
};


shipClasses = {
  MartianBattleCruiser: new shipClass('MartianBattleCruiser', 'obj/MartianBC.js', 1500, {x:0.2, y:0.2, z:0.2}, 'ship'),

  TorpedoMkI: new shipClass('TorpedoMkI', 'obj/Torpedo.js', 1, {x:1,y:1,z:1}, 'torpedo'),

  MartianDestroyer: new shipClass('MartianDestroyer', 'obj/MartianDestroyer.js', 800, {x:0.4, y:0.4, z:0.4}, 'ship'),
};
