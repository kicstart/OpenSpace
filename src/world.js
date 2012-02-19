define([
  'backbone',
  'underscore',
  'collection/vessels',
  'model/ship',
], function(Backbone, _, Vessels, Ship) {
  var World = Backbone.Model.extend({
    defaults: {
      gameTime: 33,
    },

    initialize: function(options) {
      this.objects = new Vessels();

      this.objects.bind('destroyed', this.onDestroyObject, this);
      this.objects.bind('detonation', this.onDetonation, this);
      this.objects.bind('launchTorpedo', this.addObject, this);
      this.objects.bind('selfDestruct', this.removeObject, this);
    },

    startLoop: function() {
      setInterval(_.bind(this.gameLoop, this), this.get('gameTime'));
    },

    addObject: function(obj) {
      this.objects.add(obj); // push to the world list
    },

    removeObject: function(obj) {
      this.objects.remove(obj);
    },

    getNewRandomShip: function() {
      var ship = new Ship();
      ship.position = new THREE.Vector3(
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500
      );

      return ship;
    },

    onDetonation: function(detonated) {
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

    onDestroyObject: function(obj) {
      this.trigger('destroyed', obj);
      this.objects.remove(obj);
    },

    // main game loop should be overridden elsewhere
    // TODO: We should provide a callback list to call on every game loop
    gameLoop: function() {
      console.log('tock');
    },

    animate: function() {
      // create an array of all the objects
      var state = [];
      this.objects.each(function(object) {
        object.animate();
        state.push(object.toJSON());
      });

      return { vessels: state };
    },

    getWorldState: function() {
      var state = [];
      this.objects.each(function(object) {
        state.push(object.toJSON());
      });

      return { vessels: state};
    },
  });

  return World;
});
