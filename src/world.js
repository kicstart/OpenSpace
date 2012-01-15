define(['underscore', 'collection/ships', 'model/ship'], function(_, Ships, Ship) {
  var World = function() {
    this.objects = new Ships();
    this.gameTime = 33;
  }

  World.prototype = {
    constructor: World,  

    startLoop: function() {
      setInterval(_.bind(this.gameLoop, this), this.gameTime);
    },

    findObjectById: function(id) {
      return this.objects.get(id);
    },

    addObject: function(obj) {
      this.objects.add(obj); // push to the world list

      // TODO: should this torpedo adding be here or in the ship code?
      if (obj.get('type') == 'torpedo') { // push to the ship list if torpedo
        var ship = this.objects.get(obj.get('ownerId'));
        ship.torpedoes.add(obj);
      }
    },

    destroyObject: function(obj) {
    
      if (obj.get('type') == 'torpedo') { // remove from the ships torpedo list
        var ship = this.objects.get(obj.get('ownerId'));
        ship.destroyTorpedo(obj);
      }

      this.objects.remove(obj);

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
      this.objects.each(function(object) {
        object.animate();
        if (object.get('type') == 'ship') {
          shipStates.push(object.toJSON());
        } else {
          torpStates.push(object.toJSON());  
        }
      });

      return {ships: shipStates, torpedoes: torpStates};
    }
  }
 

  return World;
});
