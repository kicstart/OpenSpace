define([
  'backbone',
  'underscore',
  'model/vessel',
], function(Backbone, _, Vessel){
  var Vessels = Backbone.Collection.extend({
    model: Vessel,
  });

  return Vessels;
});
