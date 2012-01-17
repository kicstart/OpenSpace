define([
  'backbone',
  'underscore',
  'model/vessel',
], function(Backbone, _, Vessel){
  var Vessels = Backbone.Collection.extend({
    model: Vessel,

    /**
     * Add a new vessel or array of vessels only if not yet present
     *
     * @param Vessel|json|array
     */
    addIfNew: function(vessels) {
      if(_.isArray(vessels)) {
        _.each(vessels, function(vessel) {
          this._addIfNew(vessel);
        }, this);
      } else {
        this._addIfNew(vessels);
      }

      return this;
    },

    /**
     * Add a single vessel if new
     *
     * @param Vessel|json vessel
     */
    _addIfNew: function(vessel) {
      if (!this.get(vessel.id)) {
        this.add(vessel);
      }
    }
  });

  return Vessels;
});
