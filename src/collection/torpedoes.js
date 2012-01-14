define([
  'backbone',
  'underscore',
  'model/torpedo',
], function(Backbone, _, Torpedo){
  var Torpedoes = Backbone.Collection.extend({
    model: Torpedo,
  });

  return Torpedoes;
});
