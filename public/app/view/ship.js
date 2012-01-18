define([
  'backbone',
  'underscore',
  'jquery',
  'model/vessel',
  'view/torpedo',
  'text!template/ship.tpl.html',
], function(Backbone, _, $, Ship, TorpedoView, shipTemplate) {
  
  var ShipView = Backbone.View.extend({
  
    tagName: 'div',
    className: 'ship',

    template: shipTemplate,

    events: {
      'click .ship-controls .thrust':      'thrust',
      'click .ship-controls .drive':       'drive',
      'click .ship-controls .fire':        'fire',
    },

    initialize: function(options) {
      _.bindAll(this); // bind all functions on this so this means this :)

      this.torpedoViews = [];
      this.socket = options.socket;
      this.torpedoes = options.torpedoes;
      console.log('torps', this.torpedoes);
      this.model.bind('change', this.update, this); 
      this.torpedoes.bind('add', this.addTorpedo, this);
      this.torpedoes.bind('remove', this.removeTorpedo, this);
    },

    render: function() {
      $(this.el).html(_.template(this.template, this.model.toJSON()));

      this.torpedoes.each(function(torpedo) {
        this.addTorpedo(torpedo);
      }, this);
      return this;
    },

    thrust: function(e) {
      var target = $(e.target);

      if (target.hasClass('rollLeft'))
        this.socket.emit('ship.thrust', {type: 'rollLeft', shipId: this.model.id});
      if (target.hasClass('rollRight'))
        this.socket.emit('ship.thrust', {type: 'rollRight', shipId: this.model.id});
      if (target.hasClass('pivotLeft'))
        this.socket.emit('ship.thrust', {type: 'pivotLeft', shipId: this.model.id});
      if (target.hasClass('pivotRight'))
        this.socket.emit('ship.thrust', {type: 'pivotRight', shipId: this.model.id});
      if (target.hasClass('noseUp'))
        this.socket.emit('ship.thrust', {type: 'noseUp', shipId: this.model.id});
      if (target.hasClass('noseDown'))
        this.socket.emit('ship.thrust', {type: 'noseDown', shipId: this.model.id});
    },

    update: function() {
      this.$('.position .x').html(this.model.position.x); 
      this.$('.position .y').html(this.model.position.y); 
      this.$('.position .z').html(this.model.position.z); 
    },

    drive: function() {
      this.socket.emit('ship.drive', {shipId: this.model.id});
    },

    fire: function() {
      this.socket.emit('torpedo.fire', {shipId: this.model.id}); //function(torpedo){
            //$('#message').append('<div>I fired a torpedo ' + torpedo.id + '</div>');
          //});

    },

    addTorpedo: function(torpedo) {
      var torpedoView = new TorpedoView({model: torpedo, socket: this.socket});
      this.torpedoViews[torpedo.id] = torpedoView;

      this.$('.torpedoes').append(torpedoView.render().el);
    },

    removeTorpedo: function(torpedo) {
      this.torpedoViews[torpedo.id].remove();
    },
  });

  return ShipView;

});
