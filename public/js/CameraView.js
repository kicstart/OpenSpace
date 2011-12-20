CameraViewController = function(){
  this.currentView = 1;
  this.views = {1:{'name':'front', f:this.front},
                2:{'name':'back', f:this.back},
                3:{'name':'left', f:this.left},
                4:{'name':'right', f:this.right},
                5:{'name':'top', f:this.top},
                6:{'name':'bottom', f:this.bottom},
                7:{'name':'inspection', f:this.inspection},
                0:{'name':'lookAt', f:this.lookAt},
               };
  this.target = {x:0, y:0, z:0};
  this.zoom = 0;
  this.zoomScale = 100;
  this.currentState = this.views[this.currentView].name;
};

CameraViewController.prototype = {
  
  constructor: CameraViewController,

  init: function(){
  },

  setView: function(cameraCode){
    if(cameraCode in this.views){
      this.currentView = cameraCode;
      this.currentState = this.views[cameraCode].name; 
    }
    else {
      this.currentView = 1;
      this.currentState = this.views[1].name;
    };
  },

  setCamera: function(){
    var p = ships[shipID].position;
    var q = ships[shipID].mesh.quaternion;
    camera.position.x = p.x;
    camera.position.y = p.y;
    camera.position.z = p.z;
    this.views[this.currentView].f(this);
  },

  front: function(context){
    var vec = ships[shipID].getForwardVector();
    var lookAtPt = camera.position.clone();
    vec.setLength(100);
    lookAtPt.add(vec, lookAtPt);
    //attempt 1
    //camera.rotation.setRotationFromMatrix(ships[shipID].mesh.matrix);

    //attempt 2 - doesn't seem to look anywhere, stright ahead
    //camera.matrix.lookAt(camera.position, lookAtPt, ships[shipID].mesh.up);
    
    //attempt 3 - same effect as 1
    //camera.matrix = ships[shipID].mesh.matrix.clone();
    
    //mvp
    camera.lookAt(lookAtPt);
    vec.setLength(this.zoom * this.zoomScale);
    //camera.position.x += vec.x;
    //camera.position.y += vec.y;
    //camera.position.z += vec.z; 
  },

  back: function(context){
    var vec = ships[shipID].getBackwardVector();
    var lookAtPt = camera.position.clone();
    vec.setLength(100);
    lookAtPt.add(vec, lookAtPt);
    camera.lookAt(lookAtPt);
    vec.setLength(this.zoom * this.zoomScale);
    //camera.position.x += vec.x;
    //camera.position.y += vec.y;
    //camera.position.z += vec.z; 
  },

  left: function(context){
    var vec = ships[shipID].getLeftVector();
    var lookAtPt = camera.position.clone();
    vec.setLength(100);
    lookAtPt.add(vec, lookAtPt);
    camera.lookAt(lookAtPt);
    vec.setLength(this.zoom * this.zoomScale);
    //camera.position.x += vec.x;
    //camera.position.y += vec.y;
    //camera.position.z += vec.z; 
  },

  right: function(context){
    var vec = ships[shipID].getRightVector();
    var lookAtPt = camera.position.clone();
    vec.setLength(100);
    lookAtPt.add(vec, lookAtPt);
    camera.lookAt(lookAtPt);
    vec.setLength(this.zoom * this.zoomScale);
    //camera.position.x += vec.x;
    //camera.position.y += vec.y;
    //camera.position.z += vec.z; 
  },

  top: function(context){
    var vec = ships[shipID].getUpVector();
    var lookAtPt = camera.position.clone();
    vec.setLength(100);
    lookAtPt.add(vec, lookAtPt);
    camera.lookAt(lookAtPt);
    vec.setLength(this.zoom * this.zoomScale);
    //camera.position.x += vec.x;
    //camera.position.y += vec.y;
    //camera.position.z += vec.z; 
  },
 
  bottom: function(context){
    var vec = ships[shipID].getDownVector();
    var lookAtPt = camera.position.clone();
    vec.setLength(100);
    lookAtPt.add(vec, lookAtPt);
    camera.lookAt(lookAtPt);
    vec.setLength(this.zoom * this.zoomScale);
    //camera.position.x += vec.x;
    //camera.position.y += vec.y;
    //camera.position.z += vec.z; 
  },

  inspection: function(context){
    var timer = new Date().getTime() * 0.00005;
    var s = ships[shipID];
    camera.position.x += Math.sin( timer ) * 10 + 10 * context.zoom;
    camera.position.z += Math.cos( timer ) * 10 + 10 * context.zoom;
    camera.lookAt(s.mesh.position);
  },

  lookAt: function(context){
    camera.lookAt(context.target);
    //vec.setLength(this.zoom * this.zoomScale);
    //camera.position.x += vec.x;
    //camera.position.y += vec.y;
    //camera.position.z += vec.z; 
  },
};



