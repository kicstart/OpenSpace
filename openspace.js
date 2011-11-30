var express       = require('express'),
    connect       = require('connect'),
    sessionStore  = new express.session.MemoryStore();

var app = express.createServer(),
    io = require('socket.io').listen(app);

var THREE = require('./libs/three.js');

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

function quaternionFromYawPitchRoll(yaw, pitch, roll){
  var q = new THREE.Quaternion();
  var n1, n2, n3, n4, n5, n6, n7, n8, n9;
  n9 = roll * 0.5;
  n6 = Math.sin(n9);
  n5 = Math.cos(n9);
  n8 = pitch * 0.5;
  n4 = Math.sin(n8);
  n3 = Math.cos(n8);
  n7 = yaw * 0.5;
  n2 = Math.sin(n7);
  n1 = Math.cos(n7);
  q.x = ((n1 * n4) * n5) + ((n2 * n3) * n6);
  q.y = ((n2 * n3) * n5) - ((n1 * n4) * n6);
  q.z = ((n1 * n3) * n6) - ((n2 * n4) * n5);
  q.w = ((n1 * n3) * n5)  + ((n2 * n4) * n6);
  
  return q;
}

var theShip = {
  position:         {x:0, y:0, z:0},
  velocity:         {x:0, y:0, z:0},
  angularVelocity:  {x:0, y:0, z:0},
  scale:            {x:0, y:0, z:0},
  //quaternion: new THREE.Quaternion(),
  quaternion: quaternionFromYawPitchRoll(0, -Math.PI/2, Math.PI/2),
  matrix: new THREE.Matrix4(),
  animate:function(){						
    this.position.x += this.velocity.x;						
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;
    
    var yaw, pitch, roll;
    
    yaw = this.angularVelocity.z;
    pitch = this.angularVelocity.y;
    roll = this.angularVelocity.x;
    this.quaternion.multiply(this.quaternion, quaternionFromYawPitchRoll(yaw, pitch, roll));
  },

}

var game = {
  gameTime: 33,
  gameLoop: function() {
    theShip.animate();
    io.sockets.emit('openspace.loop', {position:theShip.position,
                                       velocity:theShip.velocity,
                                       angularVelocity:theShip.angularVelocity,
                                       quaternion:{x:theShip.quaternion.x,
                                                   y:theShip.quaternion.y,
                                                   z:theShip.quaternion.z,
                                                   w:theShip.quaternion.w}});
  }
}

setInterval(game.gameLoop, game.gameTime);

// this is noisy
//setInterval(function() { console.log('Ship state', theShip) }, 1000);


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
      session.touch.save();
    });
  }, 60 * 1000); // touch the session every 60 seconds;

  socket.on('disconnect', function() {
    clearInterval(sessionIntervalId);
  });

  // assign the ship
  // TODO: Assign a ship to the session

  console.log(' [*] Client connection, sid: ' + session.id)
  socket.emit('openspace.welcome', {msg: 'Welcome to OpenSpace'});

  socket.on('ship.thrust', function(ship) {
    //  TODO: Do we need to be updateing the matrix from the quaternion like this? I think this is what
    //  Kyle mentioned to do
    theShip.matrix.setPosition(theShip.position);
    theShip.matrix.scale = theShip.scale;
    theShip.matrix.setRotationFromQuaternion(theShip.quaternion);
    var direction = theShip.matrix.getColumnY();
    direction.setLength(0.005);  // impulse value, part of ship-specific properties?
    theShip.velocity.x += - direction.x;
    theShip.velocity.y += - direction.y;
    theShip.velocity.z += - direction.z;
  });

  socket.on('ship.noseDown', function() {
    theShip.angularVelocity.y += 0.0001;
  });

  socket.on('ship.noseUp', function() {
    theShip.angularVelocity.y -= 0.0001;
  });

  socket.on('ship.rollLeft', function() {
    theShip.angularVelocity.z += 0.0001;
  });

  socket.on('ship.rollRight', function() {
    theShip.angularVelocity.z -= 0.0001;
  });

  socket.on('ship.pivotLeft', function() {
    theShip.angularVelocity.x += 0.0001;
  });

  socket.on('ship.pivotRight', function() {
    theShip.angularVelocity.x -= 0.0001;
  });

  socket.on('ship.devReset', function() {
    theShip.position.x = theShip.position.y = theShip.position.z = 0;
    theShip.velocity.x = theShip.velocity.y = theShip.velocity.z = 0;
    theShip.angularVelocity.x = theShip.angularVelocity.y = theShip.angularVelocity.z = 0;
    theShip.quaternion = quaternionFromYawPitchRoll(0, -Math.PI/2, Math.PI/2); 
  });

});
app.listen(7814);
