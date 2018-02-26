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
  var ARROW = 0, BULLET = 1, CBALL = 2;
  var BAYONET = 1, ARCHER = 2, CLUB = 3, MUSKET = 4, CANNON = 5;
  var mp = false, mc = false;
  var mousePressed = function(){
    mp = true;
    mc = true;
  }
  var mouseReleased = function(){
    mp = false;
  }
  function intersect(Ex1, Ey1, Ex2, Ey2, Mx, My, Mr){
  	return dist(Ex1, Ey1, Mx, My) + dist(Ex2, Ey2, Mx, My) <= Mr/2 + dist(Ex1, Ey1, Ex2, Ey2);
  }

  function Button(){
    this.trans = 1.0;
    this.pressed = false;
  }
  Button.prototype.draw = function(x, y, tS, msg){
    textSize(tS);
    stroke(0, 255*this.trans);
    fill(0, 255*this.trans);
    rect(x, y+10, textWidth(msg)*this.trans, 2*this.trans);
    fill(0, 500*this.trans);
    text(msg, x, y);
    if(abs(mouseX - x) < textWidth(msg)/2 && abs(mouseY - y) < tS/2){
      this.pressed = true;
      if(mc) return true;
      this.trans = constrain(this.trans*1.1+0.02, 0.1, 1);
    }else{
      this.trans = constrain(this.trans/1.1+0.02, 0.1, 1);
    }
    this.pressed = false;
    return false;
  }
  var B = [...Array(30)].map(() => new Button());
  var e = []; // Entities
  var p = []; // Projectiles
  var atk = [null, 36, 1, 10, 1, 1];
  var hp = [null, 100, 80, 140, 80, 300];
  var omult = [null, 1, 1.2, 1, 1.2, 0.3]
  var oomph = [1.2, 1.6, 2.3];
  var dmg = [15, 45, 30];
  var dtr = [40, 20, 35]; // Distance TRaveled
  var pierce = [1, 2, 10];
  function Projectile(x, y, r, v, alignment, ID){
    this.x = x;
    this.y = y;
    this.r = r;
    this.v = v;
    this.a = alignment;
    this.ID = ID;
    this.t = dtr[ID];
    this.pierce = pierce[ID];
  }
  Projectile.prototype.draw = function(){
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.r);
    switch(this.ID){
      case ARROW:
        image(arrow, 0, 0, 11, 2);
        break;
      case BULLET:
        fill(0, 0, 0, this.t*20);
        ellipse(0, 0, 2, 2);
        break;;
      case CBALL:
        fill(0, 0, 0, 2*min(this.t*10, this.pierce*30));
        ellipse(0, 0, 4, 4);
        break;
    }
    popMatrix();
  };
  Projectile.prototype.move = function(){
    this.px = this.x;
    this.py = this.y;
    this.x = (this.x + cos(this.r) * this.v + width) % width;
    this.y = (this.y + sin(this.r) * this.v + height) % height;
    for(var $ = 0; $ < e.length; $ ++){
      if(e[$].a === this.a) continue;
      if(intersect(this.x, this.y, this.px, this.py, e[$].x, e[$].y, this.v)){
        e[$].dmg(dmg[this.ID]);
        e[$].v -= oomph[this.ID] * omult[e[$].ID];
        this.pierce --;
      }
    }
    this.t --;
    return this.t < 0 || !this.pierce;
  };

  function drawE(a, ID){
    switch(a){
      case AME:
        fill(0, 0, 255);
      break;
      case NAT:
        fill(255, 255, 0);
    }
    switch(ID){
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
        noStroke();
        break;
      case MUSKET:
        ellipse(0, 0, 8, 8);
        fill(0, 0, 0, 200);
        rect(6, 1, 14, 2);
        break;
      case CANNON:
        ellipse(-7, 0, 8, 8);
        fill(0, 0, 0, 200);
        rect(0, 0, 14, 6);
        rect(0, -5, 6, 2);
        rect(0, 5, 6, 2);
        break;
    }
  }

  function Entity(x, y, r, alignment, ID){
    this.x = x;
    this.y = y;
    this.r = r;
    this.HP = hp[ID];
    this.ID = ID;
    this.v = 0.2;
    this.hurt = -100;
    this.ac = Math.random()/20 + 0.6;
    //this.ac = 1;
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
    drawE(this.a, this.ID);

    popMatrix();
  };
  Entity.prototype.move = function(){
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
    /*this.x += cos(this.r) * this.v;
    this.y += sin(this.r) * this.v;*/

    this.x = (this.x + cos(this.r) * this.v + width) % width;
    this.y = (this.y + sin(this.r) * this.v + height) % height;
    if(e[goTo] !== undefined){
      this.r -= constrain((this.r - atan2(e[goTo].y-this.y, e[goTo].x-this.x)) / 5, -0.06, 0.06);
    }else{
      goTo = 0;
    }
    switch(this.a){
      case AME:
        this.v = min(this.v+this.ac/10, 1.2);
      break;
      case NAT:
        this.v = min(this.v+this.ac/10, 1);
    }
    switch(this.ID){
      case ARCHER:
        this.v = dist(this.x, this.y, e[goTo].x, e[goTo].y) > 200 ? min(this.v+this.ac/10, 1) : this.v/abs(this.v)*max(abs(this.v)-this.ac/8, 0);
        if(frameCount % ~~(this.ac*180) === 0) p.push(new Projectile(this.x, this.y, this.r + random(-0.01, 0.01), 8, this.a, ARROW));
        break;
      case MUSKET:
        this.v = dist(this.x, this.y, e[goTo].x, e[goTo].y) > 140 ? min(this.v+this.ac/10, 1) : this.v/abs(this.v)*max(abs(this.v)-this.ac/8, 0);
        if(frameCount % ~~(this.ac*600) === 0) p.push(new Projectile(this.x, this.y, this.r + random(-0.2, 0.2), 18, this.a, BULLET));
        if(this.HP < 30 || dist(this.x, this.y, e[goTo].x, e[goTo].y) < 20) this.ID = BAYONET;
        break;
      case CANNON:
      this.v = dist(this.x, this.y, e[goTo].x, e[goTo].y) > 400 ? min(this.v+this.ac/10, 1) : this.v/abs(this.v)*max(abs(this.v)-this.ac/8, 0);
      if(frameCount % ~~(this.ac*400) === 0){
        p.push(new Projectile(this.x, this.y, this.r + random(-0.02, 0.02), 12, this.a, CBALL));
        this.v = -1.4;
      }
      break;
    }
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
  function newRow(x, y, amt, spread, v, a, t){
    for(var i = 0; i < amt; i ++){
      e.push(new Entity(x+(i-amt/2)*spread, y + random(-v, v), a===NAT*Math.PI-Math.PI/2, a, t));
    }
  }
  function restoreState(a){
    let out = [];
    for(let i = 0; i < a.length; i ++){
      out.push(new Entity(a[i].x, a[i].y, a[i].r, a[i].a, a[i].ID));
    }
    return out;
  }
  var setup = restoreState(e);
  /*e = [];
  for(var i = 0; i < 30; i ++){
    e.push(new Entity(500+(i-10)*5, 800 + random(-5,5), -Math.PI/2, AME, MUSKET));
    e.push(new Entity(500+(i-140)*5, 750 + random(-5,5), -Math.PI/2, AME, ARCHER));
    e.push(new Entity(500+(i-10)*5, 700 + random(-5,5), -Math.PI/2, AME, ARCHER));
    e.push(new Entity(500+(i-10)*30, 90 + random(-5,5), Math.PI/2, NAT, CLUB));
    e.push(new Entity(500+(i-10)*25, 120 + random(-5,5), Math.PI/2, NAT, CLUB));
    e.push(new Entity(500+(i-10)*20, 150 + random(-5,5), Math.PI/2, NAT, CLUB));
    //e.push(new Entity(500+(i-10)*25, 200 + random(-5,5), Math.PI/2, NAT, ARCHER));
  }*/
  var selected = null;
  var started = false;
  var draw = function(){
    background(255, 255, 255);
    started = B[10].draw(900, 100, 15, started ? "PAUSE" : "START") ? !started : started;
    if(B[11].draw(900, 150, 15, "RESET")) e = restoreState(setup);
    if(B[12].draw(900, 200, 15, "CLEAR")) e = [];
    if(B[11].pressed || B[12].pressed){
      started = false;
      p = [];
      selected = null;
    }
    if(!started){
      noStroke();
      fill(0, 0, 0, 100 * (1 - B[10].trans));
      rect(500, 400, 1100, 3);
      let pselect = selected;
      if(B[BAYONET].draw(900, 300, 20, "BAYONET")) selected = selected === BAYONET ? null : BAYONET;
      if(B[ARCHER].draw(900, 360, 20, "ARCHER")) selected = selected === ARCHER ? null : ARCHER;
      if(B[CLUB].draw(900, 420, 20, "CLUB")) selected = selected === CLUB ? null : CLUB;
      if(B[MUSKET].draw(900, 480, 20, "MUSKET")) selected = selected === MUSKET ? null : MUSKET;
      if(B[CANNON].draw(900, 540, 20, "CANNON")) selected = selected === CANNON ? null : CANNON;
      if(selected){
        B[selected].trans = 1.1;
        pushMatrix();
        translate(mouseX, mouseY);
        rotate(Math.PI/2 + Math.PI*(mouseY>400));
        drawE(1 + (mouseY>400), selected);
        popMatrix();
        if((mc || (mp && dist(mouseX, mouseY, pmouseX, pmouseY) > 8)) && pselect === selected){
          e.push(new Entity(mouseX, mouseY, Math.PI*(mouseY<400) - Math.PI/2, 1 + (mouseY>400), selected));
          setup = restoreState(e);
        }
      }
    }
    //if(e.length<100)e.push(new Entity(random(100,700),random(50,100), Math.PI/2, NAT, ARCHER));
    noStroke();
    for(var i = 0; i < e.length; i ++){
      e[i].draw();
      if(started) e[i].move();
      if((20+e[i].hurt-frameCount) > 0){
        fill(255, 0, 0, (20+e[i].hurt-frameCount)*6);
        ellipse(e[i].x, e[i].y, 8, 8);
        fill(255-255*e[i].HP/e[i].mHP, 255*e[i].HP/e[i].mHP, 0, 12*(20+e[i].hurt-frameCount));
        rect(e[i].x, e[i].y-8, 10*e[i].HP/100/*e[i].mHP*/, 2)
      }
      if(e[i].HP <= 0){
        e.splice(i, 1);
        continue;
      }
    }
    for(var i = 0; i < p.length; i ++){
      p[i].draw();
      if(started && p[i].move()) p.splice(i, 1);
    }
    frameCount -= !started;
    mc = false;
  };
}};;
