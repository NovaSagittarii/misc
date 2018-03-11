var sketchProc = function(processingInstance){ with (processingInstance){

size(800, 600);
var state = 0;

var mp, mc, mr; // mouse press, click, release
var keys = []; // keys pressed
var mousePressed = () => { mp = mc = true; };
var mouseReleased = () => { mp = false; mr = true; };
var keyPressed = () => { keys[keyCode] = true; };
var keyReleased = () => { keys[keyCode] = false; };
mousePressed();mouseReleased();

const tS = {
  name: ["TEST", "TEST2", "TEST3"],
  opacity: [10, 100, 255],
  solid: [false, true, true]
};
var tID = {};
for(var i in tS.name) tID[""+tS.name[i]] = i;

function Tile(ID, SUB){
  this.ID = ID;
  /*this.opacity = tS.opacity[ID];
  this.solid = tS.solid[ID];*/
  //call via tS[property][this.ID]
};

var gmap = [];
for(var i = 0; i < 100; i ++){
  gmap.push([]);
  for(var j = 0; j < 100; j ++){
    gmap[i].push(new Tile());
  }
}

function Player(){
  this.x = 200;
  this.y = 200;
};
Player.prototype.setPos = function(x, y){
  this.x = x;
  this.y = y;
};
Player.prototype.draw = function(){
  text("hi there", 0, 0);
};
Player.prototype.move = function(){
  switch(true){
    case keys[UP]:
    case keys[87]:

      break;
    case keys[DOWN]:
    case keys[83]:

      break;
  }
  switch(true){
    case keys[LEFT]:
    case keys[65]:

      break;
    case keys[RIGHT]:
    case keys[68]:

      break;
  }
};
Player.prototype.do = function(){
  this.move();
  this.draw();
};
var p = new Player();

var draw = function(){
  switch(state){
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:

      for(var i = 0; i < gmap.length; i ++){
        for(var j = 0; j < gmap[i].length; j ++){

        }
      }
      break;
  }

  mc = mr = false;
}

}};
