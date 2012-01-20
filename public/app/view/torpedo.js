define([
  'backbone',
  'underscore',
  'jquery',
  'view/vessel',
  'model/vessel',
  'text!template/torpedo.tpl.html',
], function(Backbone, _, $, VesselView, Torpedo, torpedoTemplate) {

  var TorpedoView = Backbone.View.extend({
    tagName: 'div',
    className: 'torpedo',

    template: torpedoTemplate,

    events: {
      'click .torpedo-controls .thrust':    'thrust',
      'click .torpedo-controls .drive':     'drive',
      'click .torpedo-controls .detonate':  'detonate',
    },

    initialize: function(options) {
      _.bindAll(this);
      console.log('TorpView init', this);

      this.socket = options.socket;
      this.model.bind('change', this.update, this);
    },

    render: function() {
      $(this.el).html(_.template(this.template, this.model.toJSON()));

      return this;
    },

    thrust: function(e) {
      var target = $(e.target);

      if (target.hasClass('rollLeft'))
        this.socket.emit('torpedo.thrust', {type: 'rollLeft', torpedoId: this.model.id});
      if (target.hasClass('rollRight'))
        this.socket.emit('torpedo.thrust', {type: 'rollRight', torpedoId: this.model.id});
      if (target.hasClass('pivotLeft'))
        this.socket.emit('torpedo.thrust', {type: 'pivotLeft', torpedoId: this.model.id});
      if (target.hasClass('pivotRight'))
        this.socket.emit('torpedo.thrust', {type: 'pivotRight', torpedoId: this.model.id});
      if (target.hasClass('noseUp'))
        this.socket.emit('torpedo.thrust', {type: 'noseUp', torpedoId: this.model.id});
      if (target.hasClass('noseDown'))
        this.socket.emit('torpedo.thrust', {type: 'noseDown', torpedoId: this.model.id});
    },

    update: function() {
      this.$('.position .x').html(this.model.position.x); 
      this.$('.position .y').html(this.model.position.y); 
      this.$('.position .z').html(this.model.position.z); 
    },

    drive: function() {
      this.socket.emit('torpedo.drive', {id: this.model.id});
    },

    detonate: function() {
      this.socket.emit('torpedo.detonate', {torpedoId: this.model.id});
    },
  });

  return TorpedoView;
});
