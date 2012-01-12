define(['backbone', 'underscore', 'libs/three'], function(Backbone, _, THREE){

  var Ship = Backbone.Model.extend({
    defaults: function() {
      return {
        ownerId:          0,
        type:             'ship',
        
        hull:             800,
        torpedoInventory: 20,
        torpedoes:        new Array(),
        

        position:         new THREE.Vector3(),
        velocity:         new THREE.Vector3(),
        angularVelocity:  new THREE.Vector3(),
        scale:            new THREE.Vector3(),

        quaternion:       THREE.quaternionFromYawPitchRoll(0,0,0),
        matrix:           new THREE.Matrix4(),

      }
    },

    //TODO: Should we store the THREE objects in the attributes hash, or directly on the object?
    initialize: function(options) {
    
    },

    animate: function() {
      this.get('position').addSelf(this.get('velocity'));
      
      var yaw, pitch, roll;
      
      yaw   = this.get('angularVelocity').z;
      pitch = this.get('angularVelocity').y;
      roll  = this.get('angularVelocity').x;
      this.get('quaternion').multiply(this.get('quaternion'), THREE.quaternionFromYawPitchRoll(yaw, pitch, roll));
    },

    drive: function(impulse) {
      impulse = impulse || 0.001;

      this.get('matrix').setPosition(this.get('position'));
      this.get('matrix').setRotationFromQuaternion(this.get('quaternion'));
      var direction = this.get('matrix').getColumnZ();
      direction.setLength(impulse);  // impulse value, part of ship-specific properties?
      this.get('velocity').addSelf(direction);
    },

    distanceTo: function(v) {
      return this.get('position').distanceTo(v);
    },

    damage: function(d) {
      this.hull -= d;
    },

    thrust: function(type) {
      switch (type) {
        case 'noseDown':
          this.get('angularVelocity').y += 0.0001;
          break;
        case 'noseUp':
          this.get('angularVelocity').y -= 0.0001;
          break;
        case 'rollLeft':
          this.get('angularVelocity').z += 0.0001;
          break;
        case 'rollRight':
          this.get('angularVelocity').z -= 0.0001;
          break;
        case 'pivotLeft':
          this.get('angularVelocity').x += 0.0001;
          break;
        case 'pivotRight':
          this.get('angularVelocity').x -= 0.0001;
          break;
      }
    },

    hasTorpedoes: function() {
      return this.get('torpedoInventory') > 0;
    },

    decTorpedoes: function() {
      this.set({torpedoInventory: this.get('torpedoInventory') - 1});
    },

    destroyTorpedo: function (torpedo) {
      if (this.type != 'ship') return;

      this.torpedos = _.reject(this.torpedos, function(t) { return t.id == torpedo.id });
    },

    reset: function() {
      this.get('position').set(0,0,0);
      this.get('velocity').set(0,0,0);
      this.get('angularVelocity').set(0,0,0);
      this.get('quaternion') = THREE.quaternionFromYawPitchRoll(0, 0, 0); 
    },

    _threeToJSON: function(t) {
      return {
        x: t.x,
        y: t.y,
        z: t.z,
      }
    },

    // TODO: This should probably be toJSON()
    getState: function() {
      return {
        id              : this.id,
        ownerId         : this.get('ownerId'),
        type            : this.get('type'),
        hull            : this.get('hull'),
        position        : this._threeToJSON(this.get('position')), 
        velocity        : this._threeToJSON(this.get('velocity')),
        angularVelocity : this._threeToJSON(this.get('angularVelocity')),
        quaternion      : {
          x : this.get('quaternion').x,
          y : this.get('quaternion').y,
          z : this.get('quaternion').z,
          w : this.get('quaternion').w,
        },
      }
    },

    // useful for intiliziting the position of a torpedo
    // TODO: this should probably by fromJSON()
    setState: function(state) {
      this.set({hull: state.hull});
      this.get('position').copy(state.position);
      this.get('velocity').copy(state.velocity);
      this.get('angularVelocity').copy(state.angularVelocity);

      this.get('quaternion').copy(state.quaternion);
    },

  });

  return Ship;
});

