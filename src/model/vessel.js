define([
  'backbone', 
  'underscore',
  'three',
], function(Backbone, _, THREE) {

  var Vessel = Backbone.Model.extend({
    defaults: {
      type:   'vessel',
      hull:   800,
    },

    //TODO: Should we store the THREE objects in the attributes hash, or directly on the object?
    initialize: function(options) {
      this.id = this.cid; 

      this.position =         new THREE.Vector3();
      this.velocity =         new THREE.Vector3();
      this.angularVelocity =  new THREE.Vector3();
      this.scale =            new THREE.Vector3();
      this.quaternion =       THREE.quaternionFromYawPitchRoll(0,0,0);
      this.matrix =           new THREE.Matrix4();
    },

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
      this.set({hull: this.get('hull') - d});
      if (this.get('hull') <= 0) {
        this.trigger('destroyed', this);
      }
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


    _threeToJSON: function(t) {
      return {
        x: t.x,
        y: t.y,
        z: t.z,
      }
    },

    reset: function() {
      this.position.set(0,0,0);
      this.velocity.set(0,0,0);
      this.angularVelocity.set(0,0,0);
      this.quaternion = THREE.quaternionFromYawPitchRoll(0, 0, 0); 
    },

    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.call(this);
      json.id = this.id || this.cid;
      json.position = this._threeToJSON(this.position);
      json.velocity = this._threeToJSON(this.velocity);
      json.angularVelocity = this._threeToJSON(this.angularVelocity);
      json.quaternion = {
        x : this.quaternion.x,
        y : this.quaternion.y,
        z : this.quaternion.z,
        w : this.quaternion.w,
      }

      return json;
    },

    setPositionState: function(json) {
      this.position.copy(json.position);
      this.velocity.copy(json.velocity);
      this.angularVelocity.copy(json.angularVelocity);

      this.quaternion.copy(json.quaternion);
    },
  });

  return Vessel;

});
