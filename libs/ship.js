define(['backbone', 'underscore', 'libs/three'], function(Backbone, _, THREE){
  var Ship = function(type,x,y,z) {
    this.id = 0;
    this.ownerId = 0;
    this.type = type || 'ship';
    this.hull = 800;

    this.position         = new THREE.Vector3(x,y,z);
    
    this.velocity         = new THREE.Vector3();
    this.angularVelocity  = new THREE.Vector3();
    this.scale            = new THREE.Vector3();

    this.quaternion       = THREE.quaternionFromYawPitchRoll(0, 0, 0);
    this.matrix           = new THREE.Matrix4();

    this.torpedoInventory = 20;
    this.torpedoes        = new Array();
  }

  Ship.prototype = {
    constructor: Ship,

    animate: function() {
      this.position.addSelf(this.velocity);
      
      var yaw, pitch, roll;
      
      yaw   = this.angularVelocity.z;
      pitch = this.angularVelocity.y;
      roll  = this.angularVelocity.x;
      this.quaternion.multiply(this.quaternion, THREE.quaternionFromYawPitchRoll(yaw, pitch, roll));
    },

    drive: function(impulse) {
      impulse = impulse || 0.001;

      this.matrix.setPosition(this.position);
      this.matrix.setRotationFromQuaternion(this.quaternion);
      var direction = this.matrix.getColumnZ();
      direction.setLength(impulse);  // impulse value, part of ship-specific properties?
      this.velocity.addSelf(direction);
    },

    distanceTo: function(v) {
      return this.position.distanceTo(v);
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
      this.position.set(0,0,0);
      this.velocity.set(0,0,0);
      this.angularVelocity.set(0,0,0);
      this.quaternion = THREE.quaternionFromYawPitchRoll(0, 0, 0); 
    },

    _threeToJSON: function(t) {
      return {
        x: t.x,
        y: t.y,
        z: t.z,
      }
    },

    getState: function() {
      return {
        id              : this.id,
        ownerId         : this.ownerId,
        type            : this.type,
        hull            : this.hull,
        position        : this._threeToJSON(this.position), 
        velocity        : this._threeToJSON(this.velocity),
        angularVelocity : this._threeToJSON(this.angularVelocity),
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
      this.hull             = state.hull;
      this.position.copy(state.position);
      this.velocity.copy(state.velocity);
      this.angularVelocity.copy(state.angularVelocity);

      this.quaternion.copy(state.quaternion);
    },

  }

  return Ship;
});

