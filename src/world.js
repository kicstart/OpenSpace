define([
  'backbone',
  'underscore',
  'collection/vessels',
], function(Backbone, _, Vessels) {
  var World = Backbone.Model.extend({
    defaults: {
      gameTime: 33,
    },

    initialize: function(options) {
      this.objects = new Vessels();

      this.objects.bind('destroyed', this.destroyObject, this);
      this.objects.bind('detonation', this.detonation, this);
      this.objects.bind('launchTorpedo', this.addObject, this);

    },

    startLoop: function() {
      setInterval(_.bind(this.gameLoop, this), this.get('gameTime'));
    },

    addObject: function(obj) {
      this.objects.add(obj); // push to the world list
    },

    detonation: function(detonated) {
      if (detonated == null) return;

      this.trigger('detonation', detonated);
      this.objects.remove(detonated);

      // calc damage radius
      var dVector = detonated.position;
      this.objects.each(function(obj) {
        obj.damage(detonated.get('yield')/Math.pow(obj.distanceTo(dVector),2));
        console.log('   [d] Damaging obj:', obj.id, ' hull:' , obj.get('hull'));
      });
    },

    destroyObject: function(obj) {
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
  });

  return World;
});
