Ship = function(shipClass){
  this.id = -1;
  this.position = {x:0,y:0,z:0};
  this.velocity = {x:0,y:0,z:0};
  this.angularVelocity = {x:0,y:0,z:0};
  this.mesh = new THREE.Mesh(); 
  this.shipClass = shipClass;
};

Ship.prototype = {
  
  constructor: Ship,

  load: function(callback){
    var loader = new THREE.JSONLoader(true);
    var scope = this;
    var handler = function(geo){
        geo.materials[0].shading = THREE.FlatShading;
        var material = new THREE.MeshFaceMaterial();
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
};


shipClass = function(name, mesh_url, hull_pts, max_angulars){
  this.name = name;
  this.mesh_url = mesh_url;
  this.hull_pts = hull_pts !== undefined ? hull_pts : 100;
  this.max_angulars = max_angulars !== undefined ? max_angulars : {x:0.3, y:0.3, z:0.3};
};


shipClasses = {
  MartianBattleCruiser: new shipClass('MartianBattleCruiser', 'obj/MartianBC.js', 1500, {x:0.2, y:0.2, z:0.2}),

  TorpedoMkI: new shipClass('TorpedoMkI', 'obj/Torpedo.js', 1, {x:1,y:1,z:1}),

  MartianDestroyer: new shipClass('MartianDestroyer', 'obj/MartianDestroyer.js', 800, {x:0.4, y:0.4, z:0.4}),
};
