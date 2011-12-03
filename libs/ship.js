var _             = require('underscore')._; // underscore saves much headache

var OpenSpace = {};

OpenSpace.quaternionFromYawPitchRoll = function(yaw, pitch, roll){
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
}

OpenSpace.Ship = function(type,x,y,z) {
  this.id = 0;
  this.type = type || 'ship'

  this.position   = {};
  this.position.x = x || 0;
  this.position.y = y || 0;
  this.position.z = z || 0;
  
  this.velocity         = {x:0,y:0,z:0};
  this.angularVelocity  = {x:0, y:0, z:0};
  this.scale            = {x:0, y:0, z:0};

  this.quaternion       = OpenSpace.quaternionFromYawPitchRoll(0, 0, 0);
  this.matrix           = new THREE.Matrix4();

  this.torpedoes        = new Array();
}

OpenSpace.Ship.prototype = {
  constructor: OpenSpace.Ship,

  animate: function() {
    this.position.x += this.velocity.x;						
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;
    
    var yaw, pitch, roll;
    
    yaw   = this.angularVelocity.z;
    pitch = this.angularVelocity.y;
    roll  = this.angularVelocity.x;
    this.quaternion.multiply(this.quaternion, OpenSpace.quaternionFromYawPitchRoll(yaw, pitch, roll));
  },

  drive: function(impulse) {
    impulse = impulse || 0.005;

    this.matrix.setPosition(this.position);
    this.matrix.scale = this.scale;
    this.matrix.setRotationFromQuaternion(this.quaternion);
    var direction = this.matrix.getColumnZ();
    direction.setLength(impulse);  // impulse value, part of ship-specific properties?
    this.velocity.x +=  direction.x;
    this.velocity.y +=  direction.y;
    this.velocity.z +=  direction.z;
  },

  thrust: function(type) {
    switch (type) {
      case 'noseDown':
        this.angularVelocity.y += 0.0001;
        break;
      case 'noseUp':
        this.angularVelocity.y -= 0.0001;
        break;
      case 'rollLeft':
        this.angularVelocity.z += 0.0001;
        break;
      case 'rollRight':
        this.angularVelocity.z -= 0.0001;
        break;
      case 'pivotLeft':
        this.angularVelocity.x += 0.0001;
        break;
      case 'pivotRight':
        this.angularVelocity.x -= 0.0001;
        break;
    }
  },

  reset: function() {
    this.position.x = this.position.y = this.position.z = 0;
    this.velocity.x = this.velocity.y = this.velocity.z = 0;
    this.angularVelocity.x = this.angularVelocity.y = this.angularVelocity.z = 0;
    this.quaternion = OpenSpace.quaternionFromYawPitchRoll(0, -Math.PI/2, Math.PI/2); 
  },

  getState: function() {
    return {
      id              : this.id,
      ownerId         : this.ownerId,
      type            : this.type,
      position        : this.position,
      velocity        : this.velocity,
      angularVelocity : this.angularVelocity,
      quaternion      : {
        x : this.quaternion.x,
        y : this.quaternion.y,
        z : this.quaternion.z,
        w : this.quaternion.w,
      },
    }
  },

  // useful for intiliziting the position of a torpedo
  setState: function(state) {
    this.position         = _.clone(state.position);
    this.velocity         = _.clone(state.velocity);
    this.angularVelocity  = _.clone(state.angularVelocity);

    quaternion = _.clone(state.quaternion);

    this.quaternion.x     = quaternion.x;
    this.quaternion.y     = quaternion.y;
    this.quaternion.z     = quaternion.z;
    this.quaternion.w     = quaternion.w;
  },

}

module.exports = OpenSpace;
