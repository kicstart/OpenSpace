define([
  'backbone', 
  'underscore', 
  'collection/vessels',
  'model/ship'
], function(Backbone, _, Vessels, Ship) {
  var Ships = Vessels.extend({
    model: Ship,
  });

  return Ships;
});
