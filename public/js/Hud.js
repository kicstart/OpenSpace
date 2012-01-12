Hud = function(){
  this.top = document.createElement('div');
  this.left = document.createElement('div');
  this.right = document.createElement('div');
  this.bottom = document.createElement('div');
  this.upper = document.createElement('div');
  this.SHP = new SHP();
  this.CAM = new CAM();
  this.RDR = new RDR();
  this.WPN = new WPN();
  this.TAG = new TAG(this.top);
};

Hud.prototype = {
  constructor: Hud,
  init: function(parentNode){
    this.SHP.init();  
    this.CAM.init(); 
    this.RDR.init();
    this.WPN.init();
    this.top.id = 'hud';
    this.left.id = 'hudLeft';
    this.right.id = 'hudRight';
    this.bottom.id = 'hudBottom';
    this.upper.id = 'hudUpper';
    this.top.appendChild(this.left);
    this.top.appendChild(this.right);
    this.top.appendChild(this.upper);
    this.top.appendChild(this.bottom);
    this.left.appendChild(this.SHP.SHP);
    var b1 = document.createElement('div');
    b1.className = 'hudBreak';
    this.left.appendChild(b1);
    this.left.appendChild(this.RDR.RDR);
    this.bottom.appendChild(this.CAM.CAM);
    this.right.appendChild(this.WPN.WPN);
    this.TAG.init();
    parentNode.appendChild(this.top); 
  },
  animate: function(){
    this.SHP.animate();
    this.CAM.animate();
    this.RDR.animate();
    this.WPN.animate();
    this.TAG.animate();
  },
  newShip: function(){

  },
  shipDestroyed: function(ship){
    this.TAG.remove(ship);
    this.WPN.destroyed(ship);
  },
  setTarget: function(trgtID){
     this.WPN.targetObject = ships[trgtID];
  },
};

TAG = function(parent_elem){
    this.parent_elem = parent_elem;
    this.tags = [];
    this.projector = new THREE.Projector();
};

TAG.prototype = {
  constructor : TAG,

  init: function(){
    for (s in ships){
       if (s == shipID) continue;
       var t = document.createElement('div');
       t.className = 'tag';
       t.addEventListener('click', function(e){
         hud.setTarget(t.id);  
       });
       t.id = s;
       this.tags.push(t);
       if(ships[s].mesh != undefined){
       var p;
       p = this.projector.projectVector(ships[s].mesh.position, camera);
       t.style = 'top:' + p.y + ';left:' + p.x + ';';
       this.parent_elem.appendChild(t);
       }
    }
  },

  animate: function(){
    for (s in ships){
      if (ships[s].mesh == undefined) continue;
      if (s == shipID) continue;
      var p = this.projector.projectVector(ships[s].mesh.position, camera);
      var d = $('.tag#'+s);
      d.css('bottom', (p.y + 1) * window.innerHeight / 2 + 10);
      d.css('left', (p.x + 1) * window.innerWidth / 2);
      d.html(ships[s].distanceTo(ships[shipID]).toFixed(0));
    }
  },

  remove: function(ship){
     $('.tag#' + ship.id).remove();
  },
};

WPN = function(){
  this.WPN = document.createElement('div');
  this.targetObject = null;
  this.target = document.createElement('div');
  this.myTorps = document.createElement('div');
  this.inventory = document.createElement('div');
};

WPN.prototype = {
  constructor: WPN,

  init: function(){
    this.WPN.className = "hudBoxRight";
    this.WPN.id = 'hudWPN';
    this.WPN.innerHTML = '<h2>WPN</h2>';

    this.target.className = 'hudWidget';
    this.target.innerHTML = '<h3>wpns trgt</h3>';
    this.WPN.appendChild(this.target);

    this.myTorps.className = 'hudWidget';
    this.myTorps.innerHTML = '<h3>trpds</h3>';
    this.WPN.appendChild(this.myTorps);

    var b1 = document.createElement('div');
    b1.className = 'hudBreak';
    this.WPN.appendChild(b1);

    this.inventory.className = 'hudWidget';
    this.inventory.innerHTML = '<h3>inv</h3>';
    this.WPN.appendChild(this.inventory);
  },

  animate: function(){
    // target
    this.target.innerHTML = '<h3>wpns trgt</h3>';
    if (this.targetObject != undefined){
      this.target.innerHTML += '<p>' + this.targetObject.id + ' :: ' + this.targetObject.position.x.toFixed(0) + ' ' + this.targetObject.position.y.toFixed(0) + ' ' + this.targetObject.position.z.toFixed(0) + '</p>';
    };
    // torpedoes 
    this.myTorps.innerHTML = '<h3>trpds</h3><ul>';
    for (tid in myTorpedoes) {
      this.myTorps.innerHTML += '<li>' + tid + ' ' + myTorpedoes[tid].distance.toFixed(0) + '</li>';
    };
    this.inventory.innerHTML = '<h3>inv</h3><p><b>' + torpedoInventory + '</b></p>';
  },

  destroyed: function(s){
    if (this.targetObject.id == s.id){
      this.targetObject = undefined;
      this.target.innerHTML = '<h3>wpns trgt</h3><b>DESTROYED</b>';
    }
  },
};

RDR = function(){
  this.RDR = document.createElement('div');
  this.ships = document.createElement('div');
  this.torpedoList = document.createElement('div');
};

RDR.prototype = {
  constructor: RDR,

  init: function() {
    this.RDR.className = "hudBox";
    this.RDR.id = 'hudRDR';
    this.RDR.innerHTML = '<h2>RDR</h2>';

    this.ships.className = 'hudWidget';
    this.ships.innerHTML  = '<h3>ships</h3>';
    this.RDR.appendChild(this.ships);
    
    var b1 = document.createElement('div');
    b1.className = 'hudBreak';
    this.RDR.appendChild(b1);

    this.torpedoList.className = 'hudWidget';
    this.torpedoList.innerHTML = '<h3>trpds</h3>';
    this.RDR.appendChild(this.torpedoList);
  },

  animate: function() {
    this.ships.innerHTML = '<h3>ships</h3><ul>';
    // ship loop
    for (sid in ships){
      if(sid == shipID) continue;
      var p = ships[sid].position;
      var sHTML = '<li>' + sid + ' ' + p.x.toFixed(0) + ' ';
      sHTML += p.y.toFixed(0) + ' ' + p.z.toFixed(0) + '</li>';
      this.ships.innerHTML += sHTML;
    };
    this.ships.innerHTML += '</ul>';

    this.torpedoList.innerHTML = '<h3>trpds</h3><ul>';
    // torp loop
    for (tid in torpedoes){
      if (myTorpedoes.hasOwnProperty(tid)){  // not in list?
      
      } else {
        var p = torpedoes[tid].position;
        var tHTML = '<li>' + tid + ' ' + p.x.toFixed(0) + ' ';
        tHTML += p.y.toFixed(0) + ' ' + p.z.toFixed(0) + '</li>';
        this.torpedoList.innerHTML += tHTML;
      }
    };
    this.torpedoList.innerHTML += '</ul>';
  },
};

CAM = function(){
  this.CAM = document.createElement('div');
  this.name = document.createElement('div');
  this.zoom = document.createElement('div');
};

CAM.prototype = {
  constructor: CAM,

  init: function(){
    this.CAM.className = 'hudBoxBottom';
    this.CAM.id = 'hudCAM';
    this.CAM.innerHTML = '<h2>CAM</h2>';

    this.name.className = 'hudWidget';
    this.name.innerHTML = '<h3>view</h3>';
    this.CAM.appendChild(this.name);

    this.zoom.className = 'hudWidget';
    this.zoom.innerHTML = '<h3>zoom</h3>';
    this.CAM.appendChild(this.zoom);
  },

  animate: function(){
    this.name.innerHTML = '<h3>view</h3>';
    this.name.innerHTML += '<span class="camName">' + camView.currentState + '</span>';

    this.zoom.innerHTML = '<h3>zoom</h3>';
    this.zoom.innerHTML += '<span class="camZoom">' + camView.zoom + '</span>';
  },
};


SHP = function(){
  this.SHP = document.createElement('div');
  this.pos = document.createElement('div');
  this.vel = document.createElement('div');
  this.ang = document.createElement('div');
  this.hull = document.createElement('div');
};

SHP.prototype = {
  constructor: SHP,

  init: function(){
    this.SHP.className = 'hudBox';
    this.SHP.id = 'hudSHP';
    this.SHP.innerHTML = '<h2>SHP</h2>'

    this.pos.className = 'hudWidget';
    this.pos.innerHTML = '<h3>pos</h3>';
    this.SHP.appendChild(this.pos);

    this.hull.className = 'hudWidget';
    this.hull.innerHTML = '<h3>hull</h3>';
    this.SHP.appendChild(this.hull);

    var breaker = document.createElement('span');
    breaker.className = 'break';
    this.SHP.appendChild(breaker);

    this.vel.className = 'hudWidget';
    this.vel.innerHTML = '<h3>vel</h3>';
    this.SHP.appendChild(this.vel);
  
    this.ang.className = 'hudWidget';
    this.ang.innerHTML = '<h3>ang</h3>';
    this.SHP.appendChild(this.ang);
  },
  
  animate: function(){
    var s = ships[shipID];
    this.pos.innerHTML = '<h3>pos</h3><ul>';
    this.pos.innerHTML += '<li>x ' + s.position.x.toFixed(1) + '</li>';
    this.pos.innerHTML += '<li>y ' + s.position.y.toFixed(1) + '</li>';
    this.pos.innerHTML += '<li>z ' + s.position.z.toFixed(1) + '</li></ul>';

    this.vel.innerHTML = '<h3>vel</h3><ul>';
    this.vel.innerHTML += '<li>x ' + s.velocity.x.toFixed(3) + '</li>';
    this.vel.innerHTML += '<li>y ' + s.velocity.y.toFixed(3) + '</li>';
    this.vel.innerHTML += '<li>z ' + s.velocity.z.toFixed(3) + '</li></ul>';

    this.ang.innerHTML = '<h3>ang</h3><ul>';
    this.ang.innerHTML += '<li>x ' + s.angularVelocity.x.toFixed(4) + '</li>';
    this.ang.innerHTML += '<li>y ' + s.angularVelocity.y.toFixed(4) + '</li>';
    this.ang.innerHTML += '<li>z ' + s.angularVelocity.z.toFixed(4) + '</li></ul>';
    var hullPct = s.hull / s.shipClass.hull_pts * 100;
    this.hull.innerHTML = '<h3>hull</h3>';
    this.hull.innerHTML += '<span class="big">' + hullPct.toFixed(0) + '</span>';
    this.hull.innerHTML += '<span class="waterMark">%</span>';
  },
};
