var express       = require('express'),
    connect       = require('connect'),
    sessionStore  = new express.session.MemoryStore(),
    _             = require('underscore')._; // underscore saves much headache

var app = express.createServer(),
    io = require('socket.io').listen(app);

var THREE = require('./libs/three.js');

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


var ships = new Array();

var game = {
  gameTime: 33,
  // main game loop
  //
  // This function calculates new location values for the ships
  // and creates a JSON world representation object to communicate to clients
  // on the openspace.loop socket topic
  gameLoop: function() {

    // create an array of all the objects
    var shipStates = {};
    var torpStates = {};
    _.each(ships, function(ship) {
      ship.animate();
      shipStates[ship.id] = ship.getState();

      _.each(ship.torpedoes, function(torpedo) {
        torpedo.animate();
        torpStates[torpedo.id] = torpedo.getState();  
      })
    });

    //create an array of all the torpedoes

    io.sockets.emit('openspace.loop', {ships: shipStates, torpedoes: torpStates});
  }
}

setInterval(game.gameLoop, game.gameTime);

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
  if (typeof session.shipId === 'undefined' ) {
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
    ships.push(ship);
  } else {
    // otherwise find the ship in the ships array
    ship = _.find(ships, function(ship) { return ship.id == session.shipId});
  }

  console.log(' [*] Client connection, sid: ' + session.id + ' shipId: ' + session.shipId)
  socket.emit('openspace.welcome', {msg: 'Welcome to OpenSpace', ship: ship});

  socket.on('ship.drive', function(ship) {
    //  TODO: Do we need to be updateing the matrix from the quaternion like this? I think this is what
    //  Kyle mentioned to do
    ship.drive();
  });

  socket.on('ship.thrust', function(message) {
    ship.thrust(message.type);
  });

  socket.on('torpedo.fire', function() {
    // TODO: it would be great if this were integrated into the ship object
    var torpedo = new Ship('torpedo');
    torpedo.setState(ship.getState());
    torpedo.ownerId = ship.id; // set a reference to the owning ship
    torpedo.drive(0.1);
    ship.torpedoes.push(torpedo);
  });

  socket.on('ship.devReset', function() {
    ship.reset();
  });

});
app.listen(7814);
