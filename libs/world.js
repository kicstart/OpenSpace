define(['underscore'], function(_) {
  var World = function() {
    this.objects = new Array();
    this.gameTime = 33;
  }

  World.prototype = {
    constructor: World,  

    startLoop: function() {
      setInterval(_.bind(this.gameLoop, this), this.gameTime);
    },

    findObjectById: function(id) {
      return _.find(this.objects, function(object) { return object.id == id });
    },

    addObject: function(obj) {
      this.objects.push(obj); // push to the world list

      if (obj.type == 'torpedo') { // push to the ship list if torpedo
        var ship = this.findObjectById(obj.ownerId);
        ship.torpedoes.push(obj);
      }
    },

    destroyObject: function(obj) {
      // remove the obj from the world list
      var newObjects = _.reject(this.objects, function(o) { return o.id == obj.id; });
    
      if (obj.type == 'torpedo') { // remove from the ships torpedo list
        var ship = this.findObjectById(obj.ownerId);
        ship.destroyTorpedo(obj);
      }
      this.objects = newObjects;

    },

    // main game loop should be overridden elsewhere
    // TODO: We should provide a callback list to call on every game loop
    gameLoop: function() {
      console.log('tock');
    },

    getWorldState: function() {
      // create an array of all the objects
      var shipStates = [];
      var torpStates = [];
      _.each(this.objects, function(object) {
        object.animate();
        if (object.type == 'ship') {
          shipStates.push(object.getState());
        } else {
          torpStates.push(object.getState());  
        }
      });

      return {ships: shipStates, torpedoes: torpStates};
    }
  }
 

  return World;
});
