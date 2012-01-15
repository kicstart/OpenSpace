define([
  'backbone',
  'underscore',
  'collection/vessels',
  'model/torpedo',
], function(Backbone, _, Vessels, Torpedo){
  var Torpedoes = Vessels.extend({
    model: Torpedo,
  });

  return Torpedoes;
});
