var sketchProc = function(processingInstance){ with (processingInstance){
  size(1000, 800);
  //Made for Extra Credit HSS8 Girkin

  textAlign(CENTER, CENTER);
  textFont(createFont("monospace"), 1);
  rectMode(CENTER);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noStroke();
  frameRate(60);

{
  // Previous arrow drawing i made
  background(0, 0, 0, 0);
  strokeWeight(1);
  stroke(148, 94, 0);
  line(2, 1.5, 22, 1.5);
  noStroke();
  fill(0, 0, 0);
  quad(25, 2.5, 17, 5, 21, 2.5, 17, 0);
  quad(6, 2, 4, 0.5, 0, 1, 2, 2);
  quad(6, 3, 4, 4.5, 0, 4, 2, 3);
  var arrow = get(0, 0, 22, 4);

}

  var NAT = 1, AME = 2;
  var ARROW = 0, BULLET = 1;
  var BAYONET = 0, ARCHER = 1, CLUB = 2, MUSKET = 3;

  function intersect(Ex1, Ey1, Ex2, Ey2, Mx, My, Mr){
  	return dist(Ex1, Ey1, Mx, My) + dist(Ex2, Ey2, Mx, My) <= Mr/2 + dist(Ex1, Ey1, Ex2, Ey2);
  }
  var e = []; // Entities
  var p = []; // Projectiles
  var atk = [36, 1, 10, 1];
  var hp = [100, 80, 140, 80];
  var oomph = [1.4, 2.4];
  var dmg = [25, 40];
  var dtr = [40, 20]; // Distance TRaveled
  function Projectile(x, y, r, v, alignment, ID){
    this.x = x;
    this.y = y;
    this.r = r;
    this.v = v;
    this.a = alignment;
    this.ID = ID;
    this.t = dtr[ID];
  }
  Projectile.prototype.draw = function(){
    this.px = this.x;
    this.py = this.y;
    this.x += cos(this.r) * this.v;
    this.y += sin(this.r) * this.v;
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.r);
    switch(this.ID){
      case ARROW:
        image(arrow, 0, 0, 11, 2);
        break;
      case BULLET:
        fill(0, 0, 0);
        ellipse(0, 0, 2, 2);
        break;
    }
    popMatrix();
    for(var $ = 0; $ < e.length; $ ++){
      if(e[$].a === this.a) continue;
      if(intersect(this.x, this.y, this.px, this.py, e[$].x, e[$].y, this.v )){
        e[$].dmg(dmg[this.ID]);
        e[$].v = -oomph[this.ID];
        return true;
      }
    }
    this.t --;
    return this.t < 0;
  };
  function Entity(x, y, r, alignment, ID){
    this.x = x;
    this.y = y;
    this.r = r;
    this.HP = hp[ID];
    this.ID = ID;
    this.v = 0.2;
    this.hurt = -100;
    this.ac = Math.random()/20+0.5;
    this.a = alignment;
    this.mHP = this.HP;
  };
  Entity.prototype.dmg = function(amt){
    this.HP -= amt;
    this.hurt = frameCount;
  };
  Entity.prototype.draw = function(){
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.r);
    this.tF = Infinity; //targetFound
    var goTo = null;
    for(var $ = 0; $ < e.length; $ ++){
      if(e[$].a === this.a) continue;
      if(abs(this.x-e[$].x) < 5 && abs(this.y-e[$].y) < 5){
        e[$].dmg(atk[this.ID]);
        e[$].v = -1.5;
        this.v = -0.5;
        break;
      }
      if(abs(this.x-e[$].x)+abs(this.y-e[$].y) < this.tF){
        //this.r = atan2(e[$].y-this.y, e[$].x-this.x);
        goTo = $;
        this.tF = abs(this.x-e[$].x)+abs(this.y-e[$].y);
      }
    }
    this.x += cos(this.r) * this.v;
    this.y += sin(this.r) * this.v;
    if(e[goTo] !== undefined){
      this.r -= constrain((this.r - atan2(e[goTo].y-this.y, e[goTo].x-this.x)) / 5, -0.06, 0.06);
    }else{
      goTo = 0;
    }
    switch(this.a){
      case AME:
        fill(0, 0, 255);
        this.v = min(this.v+this.ac/10, 1.2);
      break;
      case NAT:
        fill(255, 255, 0);
        this.v = min(this.v+this.ac/10, 1);
    }
    switch(this.ID){
      case BAYONET:
        ellipse(0, 0, 8, 8);
        fill(0, 0, 0, 200);
        quad(12, -4, 0, -4, 0, -1, 10, -1);
        break;
      case CLUB:
        ellipse(0, 0, 8, 8);
        fill(0, 0, 0, 200);
        ellipse(5, -4, 10, 3);
        ellipse(8, -4, 4, 4);
        break;
      case ARCHER:
        ellipse(0, 0, 8, 8);
        stroke(0, 0, 0, 200);
        line(5, 5, 5, 0);
        arc(5, 2.5, 5, 5, -Math.PI/2, Math.PI/2);
        this.v = dist(this.x, this.y, e[goTo].x, e[goTo].y) > 200 ? min(this.v+this.ac/10, 1) : max(this.v-this.ac/5, 0);
        noStroke();
        if(frameCount % ~~(this.ac*180) === 0) p.push(new Projectile(this.x, this.y, this.r + random(-0.01, 0.01), 8, this.a, ARROW));
        break;
      case MUSKET:
        ellipse(0, 0, 8, 8);
        fill(0, 0, 0, 200);
        rect(6, 1, 14, 2);
        this.v = dist(this.x, this.y, e[goTo].x, e[goTo].y) > 140 ? min(this.v+this.ac/10, 1) : max(this.v-this.ac/5, 0);
        if(frameCount % ~~(this.ac*600) === 0) p.push(new Projectile(this.x, this.y, this.r + random(-0.2, 0.2), 18, this.a, BULLET));
        if(this.HP < 30 || dist(this.x, this.y, e[goTo].x, e[goTo].y) < 20) this.ID = BAYONET;
        break;
    }
    popMatrix();
  };
  for(var i = 0; i < 20; i ++){
    e.push(new Entity(500+(i-10)*10, 500 + random(-5,5), -Math.PI/2, AME, BAYONET));
    e.push(new Entity(500+(i-10)*10, 550 + random(-5,5), -Math.PI/2, AME, BAYONET));
    e.push(new Entity(500+(i-10)*10, 600 + random(-5,5), -Math.PI/2, AME, MUSKET));
    e.push(new Entity(500+(i-10)*10, 380 + random(-5,5), Math.PI/2, NAT, CLUB));
    e.push(new Entity(500+(i-10)*12, 350 + random(-5,5), Math.PI/2, NAT, CLUB));
    e.push(new Entity(500+(i-10)*14, 320 + random(-5,5), Math.PI/2, NAT, CLUB));
    e.push(new Entity(500+(i-10)*15, 250 + random(-5,5), Math.PI/2, NAT, ARCHER));
    //e.push(new Entity(500+(i-10)*25, 200 + random(-5,5), Math.PI/2, NAT, ARCHER));
  }
  /*e = [];
  for(var i = 0; i < 30; i ++){
    e.push(new Entity(500+(i-10)*5, 800 + random(-5,5), -Math.PI/2, AME, MUSKET));
    e.push(new Entity(500+(i-10)*5, 750 + random(-5,5), -Math.PI/2, AME, ARCHER));
    e.push(new Entity(500+(i-10)*5, 700 + random(-5,5), -Math.PI/2, AME, ARCHER));
    e.push(new Entity(500+(i-10)*30, 90 + random(-5,5), Math.PI/2, NAT, CLUB));
    e.push(new Entity(500+(i-10)*25, 120 + random(-5,5), Math.PI/2, NAT, CLUB));
    e.push(new Entity(500+(i-10)*20, 150 + random(-5,5), Math.PI/2, NAT, CLUB));
    //e.push(new Entity(500+(i-10)*25, 200 + random(-5,5), Math.PI/2, NAT, ARCHER));
  }*/
  var draw = function(){
    background(255, 255, 255);
    //if(e.length<100)e.push(new Entity(random(100,700),random(50,100), Math.PI/2, NAT, ARCHER));
    for(var i = 0; i < e.length; i ++){
      e[i].draw();
      if((20+e[i].hurt-frameCount) > 0){
        fill(255, 0, 0, (20+e[i].hurt-frameCount)*6);
        ellipse(e[i].x, e[i].y, 8, 8);
        fill(255-255*e[i].HP/e[i].mHP, 255*e[i].HP/e[i].mHP, 0, 12*(20+e[i].hurt-frameCount));
        rect(e[i].x, e[i].y-5, 10*e[i].HP/e[i].mHP, 2)
      }
      if(e[i].HP <= 0){
        e.splice(i, 1);
        continue;
      }
    }
    for(var i = 0; i < p.length; i ++){
      if(p[i].draw()) p.splice(i, 1);
    }
  };
}};
