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
  paths: {
    'three':        'libs/three',
    'model':        'src/model',
    'collection':   'src/collection',
    'world':        'src/world',
  },
});

var THREE = requirejs('three');
var Ship = requirejs('model/ship');
var World = requirejs('world');

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

// Setup the world and the world communication
var world = new World();
world.bind('destroyed', function(obj) {
  if (obj.get('type') == 'ship') {
    io.sockets.emit('openspace.destroy.ship', { msg: 'Ship destroyed', ship: obj.toJSON()})
  }
});
world.bind('detonation', function(detonated) {
  console.log(' [x] Detonated torpedoId: ', detonated.id);
  io.sockets.emit('openspace.detonate.torpedo', { msg: 'Torpedo detonated', torpedo: detonated.toJSON()});
});
world.objects.bind('add', function(obj) {
  if (obj.get('type') == 'torpedo') {
    io.sockets.emit('openspace.new.torpedo', { msg: 'Torpedo detected', torpedo: obj.toJSON()}); 
    console.log(' [+] Torpedo launched. id: ', obj.id, '   ownerId: ', obj.get('ownerId'));
  } else {
    io.sockets.emit('openspace.new.ship', {msg: 'Ship detected', ship: obj.toJSON()});
    console.log(' [+] Ship launched id: ', obj.id);
  }
});

// set the gameLoop update function
world.gameLoop = function() {
  io.sockets.emit('openspace.loop', world.getWorldState());
}
world.startLoop();


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
    //
    // TODO: This will CRASH if the ship is destroyed and the client tries to reconnect

    // first time here? get yer'self a ship!
    ship = new Ship();
    ship.position = new THREE.Vector3(
      Math.random() * 1000 - 500,  
      Math.random() * 1000 - 500,  
      Math.random() * 1000 - 500
    );
  

    session.shipId = ship.id;
    session.save();
    world.addObject(ship);
    newShip = true; // so we can tell the world about us
  } else {
    // otherwise find the ship in the ships array
    ship = world.findObjectById(session.shipId);
  }

  console.log(' [*] Client connection, sid: ' + session.id + ' shipId: ' + session.shipId)
  socket.emit('openspace.welcome', {msg: 'Welcome to OpenSpace', ship: ship.toJSON(), world: world.getWorldState()});

  socket.on('ship.drive', function(data) {
    ship.drive();
  });

  socket.on('ship.thrust', function(message) {
    ship.thrust(message.type);
  });

  socket.on('torpedo.fire', function(data, fn) {
    // create an empty function so we can always call something
    if (!_.isFunction(fn))
      fn = function(arg) {};

    if (!ship.hasTorpedoes()) {
      fn({status: 'failure', msg: 'Insufficient torpedo inventory'});
      return;
    }

    var torpedo = ship.fireTorpedo();
    if (torpedo) {
      fn({status: 'success', msg: 'Torpedo fired', id: torpedo.id});
    } else {
      fn({status: 'failure', msg: 'Unknown torpedo error'});
    }
  });

  socket.on('torpedo.drive', function(data) {
    torpedo = ship.torpedoes.get(data.id);
    if (torpedo) {
      torpedo.drive(0.1);
    }
  });

  socket.on('torpedo.detonate', function(data) {
    ship.detonate(data.torpedoId);

  });

  socket.on('ship.destruct', function(message, fn) {
    world.destroyObject(ship);
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

