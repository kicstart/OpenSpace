define(['underscore', 'libs/three'], function(_, THREE){
  Ship = function(type,x,y,z) {
    this.id = 0;
    this.ownerId = 0;
    this.type = type || 'ship';
    this.hull = 800;

    this.position   = {};
    this.position.x = x || 0;
    this.position.y = y || 0;
    this.position.z = z || 0;
    
    this.velocity         = {x:0,y:0,z:0};
    this.angularVelocity  = {x:0, y:0, z:0};
    this.scale            = {x:0, y:0, z:0};

    this.quaternion       = THREE.quaternionFromYawPitchRoll(0, 0, 0);
    this.matrix           = new THREE.Matrix4();

    this.torpedoInventory = 20;
    this.torpedoes        = new Array();
  }

  Ship.prototype = {
    constructor: Ship,

    animate: function() {
      this.position.x += this.velocity.x;						
      this.position.y += this.velocity.y;
      this.position.z += this.velocity.z;
      
      var yaw, pitch, roll;
      
      yaw   = this.angularVelocity.z;
      pitch = this.angularVelocity.y;
      roll  = this.angularVelocity.x;
      this.quaternion.multiply(this.quaternion, THREE.quaternionFromYawPitchRoll(yaw, pitch, roll));
    },

    drive: function(impulse) {
      impulse = impulse || 0.001;

      this.matrix.setPosition(this.position);
      this.matrix.scale = this.scale;
      this.matrix.setRotationFromQuaternion(this.quaternion);
      var direction = this.matrix.getColumnZ();
      direction.setLength(impulse);  // impulse value, part of ship-specific properties?
      this.velocity.x +=  direction.x;
      this.velocity.y +=  direction.y;
      this.velocity.z +=  direction.z;
    },

    distanceTo: function(v) {
      var pos = this.position;
      var posVector = new THREE.Vector3(pos.x, pos.y, pos.z);
      return posVector.distanceTo(v);
    },

    damage: function(d) {
      this.hull -= d;
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

    destroyTorpedo: function (torpedo) {
      if (this.type != 'ship') return;

      this.torpedos = _.reject(this.torpedos, function(t) { return t.id == torpedo.id });
    },

    reset: function() {
      this.position.x = this.position.y = this.position.z = 0;
      this.velocity.x = this.velocity.y = this.velocity.z = 0;
      this.angularVelocity.x = this.angularVelocity.y = this.angularVelocity.z = 0;
      this.quaternion = THREE.quaternionFromYawPitchRoll(0, 0, 0); 
    },

    getState: function() {
      return {
        id              : this.id,
        ownerId         : this.ownerId,
        type            : this.type,
        hull            : this.hull,
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
      this.hull             = state.hull;
      this.velocity         = _.clone(state.velocity);
      this.angularVelocity  = _.clone(state.angularVelocity);

      quaternion = _.clone(state.quaternion);

      this.quaternion.x     = quaternion.x;
      this.quaternion.y     = quaternion.y;
      this.quaternion.z     = quaternion.z;
      this.quaternion.w     = quaternion.w;
    },

  }

  return Ship;
});

