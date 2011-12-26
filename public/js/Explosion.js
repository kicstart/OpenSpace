Explosion = function(position, power){
  this.position = position;
  this.power = power;
  this.life = power;
  this.light = new THREE.PointLight( 0xffffff, 10 );
  this.lightMesh = null;
};

Explosion.prototype = {

  constructor: Explosion,

  load: function(callback){
    var sphere = new THREE.SphereGeometry(500, 20, 20);
    this.lightMesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial(
      {color: 0xffffff, transparent: true,}));
    this.lightMesh.scale.set(0.005, 0.005, 0.005);
    this.lightMesh.position = this.position;
    this.light.position = this.position;
    callback(this.light);
    callback(this.lightMesh);
  },

  animate:function(){
    this.lightMesh.scale.x += 0.005;
    this.lightMesh.scale.y += 0.005;
    this.lightMesh.scale.z += 0.005;
    if (this.lightMesh.scale.x > 0.05){
      this.lightMesh.material.opacity -= 0.01;
      if (this.lightMesh.material.opactiry == 0){
        scene.removeChild(this.light);
        scene.removeChild(this.lightMesh);
      }
    }
  },
};
