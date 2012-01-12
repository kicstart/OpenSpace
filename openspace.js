var 
    requirejs     = require('requirejs'),
    express       = require('express'),
    connect       = require('connect'),
    sessionStore  = new express.session.MemoryStore(),
    _             = require('underscore')._; // underscore saves much headache

var app = express.createServer(),
    io = require('socket.io').listen(app);

requirejs.config({
  nodeRequire:  require,
});

var THREE = requirejs('libs/three');
console.log(THREE);

var OpenSpace = require('./libs/ship.js');

io.configure(function() {
  io.set('log level', 1);
});

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.session({
    store   : sessionStore,
    secret  : 'the cake is a L13!!!',
    key     : 'express.sid'}));

  app.use(express.static(__dirname + '/public'));
});


var game = {
  objects: new Array(),

  findObjectById: function(id) {
    return _.find(this.objects, function(object) { return object.id == id });
  },

  addObject: function(obj) {
    this.objects.push(obj); // push to the world list

    if (obj.type == 'torpedo') { // push to the ship list if torpedo
      var ship = this.findObjectById(obj.ownerId);
      ship.torpedoes.push(obj);
    }
  },

  destroyObject: function(obj) {
    // remove the obj from the world list
    var newObjects = _.reject(this.objects, function(o) { return o.id == obj.id; });
  
    if (obj.type == 'torpedo') { // remove from the ships torpedo list
      var ship = this.findObjectById(obj.ownerId);
      ship.destroyTorpedo(obj);
    }
    this.objects = newObjects;

  },

  gameTime: 33,
  // main game loop
  //
  // This function calculates new location values for the ships
  // and creates a JSON world representation object to communicate to clients
  // on the openspace.loop socket topic
  gameLoop: function() {
    //create an array of all the torpedoes

    io.sockets.emit('openspace.loop', this.getWorldState());
  },

  getWorldState: function() {
    // create an array of all the objects
    var shipStates = [];
    var torpStates = [];
    _.each(this.objects, function(object) {
      object.animate();
      if (object.type == 'ship') {
        shipStates.push(object.getState());
      } else {
        torpStates.push(object.getState());  
      }
    });
    return {ships: shipStates, torpedoes: torpStates};
  }
}

setInterval(_.bind(game.gameLoop, game), game.gameTime);

// this is noisy
//setInterval(function() { console.log('Ship state', ship) }, 1000);


// Setup socket auth to require a session
io.set('authorization', function (data, ack) {
  if (data.headers.cookie) {
    data.cookie       = connect.utils.parseCookie(data.headers.cookie);
    data.sessionId    = data.cookie['express.sid'];
    data.sessionStore = sessionStore;
    sessionStore.load(data.sessionId, function (err, session) {
      if (err || !session) {
        ack('Error', false)
      } else {
        data.session = session;
        ack(null, true);
      }
    });
  } else {
    return ack(null, true);
  }
});

var shipCounter = 0; // crude ship id generator

io.sockets.on('connection', function (socket) {
  var session = socket.handshake.session; // the session variable for this connection/user;
  var sessionIntervalId = setInterval(function () {
    session.reload(function() {
      session.touch().save();
    });
  }, 60 * 1000); // touch the session every 60 seconds;

  socket.on('disconnect', function() {
    clearInterval(sessionIntervalId);
  });
  
  // assign a ship by id to the session
  // We can't just set the ship into the session as it can't persist
  // objects with their member functions, so we just need to retrieve
  // the ship by it's id
  var ship = null; // called ship for now, for reference below
  var newShip = false;
  if (typeof session.shipId === 'undefined' || session.shipId === null) {
    // TODO: This will occasionally error out if the client is still running while the node server get's restarted
    // possible solution is to use the sessionID to identify the ship

    // first time here? get yer'self a ship!
    ship = new OpenSpace.Ship(
      'ship',
      Math.random() * 1000 - 500,  
      Math.random() * 1000 - 500,  
      Math.random() * 1000 - 500
    );
    ship.id = ++shipCounter;

    session.shipId = ship.id;
    session.save();
    game.addObject(ship);
    newShip = true; // so we can tell the world about us
  } else {
    // otherwise find the ship in the ships array
    ship = game.findObjectById(session.shipId);
  }

  console.log(' [*] Client connection, sid: ' + session.id + ' shipId: ' + session.shipId)
  socket.emit('openspace.welcome', {msg: 'Welcome to OpenSpace', ship: ship, world: game.getWorldState()});
  socket.broadcast.emit('openspace.new.ship', {msg: 'Ship detected', ship: ship.getState()}); // tell everyone (but us) that we arrived

  socket.on('ship.drive', function(data) {
    ship.drive();
  });

  socket.on('ship.thrust', function(message) {
    ship.thrust(message.type);
  });

  socket.on('torpedo.fire', function(data, fn) {
    // TODO: it would be great if this were integrated into the ship object
    if (ship.torpedoInventory > 0){
    var torpedo = new OpenSpace.Ship('torpedo');
    torpedo.id = ++shipCounter;
    torpedo.setState(ship.getState());
    torpedo.ownerId = ship.id; // set a reference to the owning ship
    torpedo.drive(1);
    game.addObject(torpedo);
    if (_.isFunction(fn)) {
      fn({status: 'success', msg: 'Torpedo fired', id: torpedo.id});
      ship.torpedoInventory -= 1;
    };
    socket.broadcast.emit('openspace.new.torpedo', { msg: 'Torpedo detected', ship: ship.getState(), torpedo: torpedo.getState()}); // the everyone (but us) that we attack!
    }});

  socket.on('torpedo.drive', function(data) {
    torpedo = _.find(ship.torpedoes, function(torpedo) { return torpedo.id == data.torpedoId });
    if (torpedo) {
      torpedo.drive(0.1);
    }
  });

  socket.on('torpedo.detonate', function(data) {
    detonated = _.find(ship.torpedoes, function(torpedo) { return torpedo.id == data.torpedoId });
    console.log(' [x] Detonated torpedoId: ', detonated.id);
    if (detonated) {
      game.destroyObject(detonated);
      // calc damage radius
      var pos = detonated.position;
      var dVector = new THREE.Vector3(pos.x, pos.y, pos.z);
      console.log(dVector);
      _.each(game.objects, function(obj) {
        obj.damage(200000/Math.pow(obj.distanceTo(dVector),2));
        if (obj.hull <= 0){
          game.destroyObject(obj);
          if (obj.type == 'ship') {
            io.sockets.emit('openspace.destroy.ship', { msg: 'Ship destroyed', ship: obj.getState()})
          }
        };
      });

      // remove the torpedo from the world and notify
      io.sockets.emit('openspace.detonate.torpedo', { msg: 'Torpedo detonated', torpedo: detonated.getState()});
      detonated = null;
    }
  });

  socket.on('ship.destruct', function(message, fn) {
    game.destroyObject(ship);
    ship = null;
    session.shipId = null;
    session.save();
    if (_.isFunction(fn)) {
      fn({status: 'success', msg: 'Your ship has self-destructed'});
    }
  });

  socket.on('ship.devReset', function() {
     ship.reset();
  });

});
app.listen(8001);

