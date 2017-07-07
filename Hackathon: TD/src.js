var sketchProc = function(processingInstance){ with (processingInstance){
  size(800, 600);
  //Made for CodeCamp Hackathon in 6 hours

  //Made for Summer CodeCamp Hackathon in 6 hours

  //size(800, 600);
  textAlign(CENTER, CENTER);
  textFont(createFont("monospace"), 1);
  rectMode(CENTER);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noStroke();
  frameRate(60);

  var route = "RRRRRRRRRR DDDDDD LLLL UUU LLLL DDDDDD RRRRRRRR RR";
  var x = 0;
  var y = 0;
  var mp = false;
  var enemies = [];
  var bullets = [];
  var gmap = [
      [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
      [9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 9],
      [9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 9],
      [9, 0, 0, 0, 0, 0, 9, 9, 9, 0, 9],
      [9, 0, 9, 9, 9, 0, 9, 9, 9, 0, 9],
      [9, 0, 9, 9, 9, 0, 9, 9, 9, 0, 9],
      [9, 0, 9, 9, 9, 0, 0, 0, 0, 0, 9],
      [9, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9],
      [9, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9],
      [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
  ];
  var state = 1;
  var money = 1000;
  var life = 25;
  var wave = 0;
  var buildMode = null;
  var paused = true;
  var tdata = {
      name: ["Basic", "Twin", "Machine Gun", "Sniper", "Advanced", "Triplet", "Gatling", "Semi-Auto"],
      desc: ["Single barreled\nslower reload", "Dual barreled\ntwice as fast\nas Basic", "Rapid fire\nlow penetration*", "Slow reload\nvery high damage", "", "", "", ""],
      cost: [150, 350, 750, 1250, 500, 1200, 1800, 2400],
      rof: [50, 22, 7, 300, 45, 15, 5, 180],
      dmg: [25, 25, 7, 200, 50, 30, 7, 200],
      pierce: [1, 1, 2, 6, 1, 1, 3, 7],
      accu: [4, 4, 12, 1, 3, 3, 15, 0],
      speed: [8, 8, 12, 18, 8, 8, 12, 16],
      range: [100, 90, 150, 400, 140, 160, 200, 400],
  };
  var edata = {
      name: ["Triangle", "Square", "Pentagon", "Hexagon", "Crasher", "Octogon", "Circle", "Nonagon", "Circle 2", "Rusher"],
      hp: [120, 350, 750, 1600, 500, 2700, 100000, 4000, 250000],
      def: [0, 0, 2, 4, 1, 5, 6, 7, 8, 4, 2],
      reward: [50, 120, 300, 450, 70, 650, 7000, 300, 0, 100],
      speed: [1.5, 1, 1, 0.8, 2, 0.6, 0.4, 2, 0.3, 3.5],
  };
  var waves = [
      {eID: 0, amt: 0, interval: 0, cR: 0},
      {eID: 0, amt: 6, interval: 200, cR: 100},
      {eID: 0, amt: 12, interval: 150, cR: 150},
      {eID: 1, amt: 6, interval: 170, cR: 200},
      {eID: 1, amt: 9, interval: 160, cR: 250},
      {eID: 2, amt: 6, interval: 300, cR: 350},
      {eID: 0, amt: 25, interval: 50, cR: 400},
      {eID: 1, amt: 10, interval: 50, cR: 450},
      {eID: 3, amt: 4, interval: 200, cR: 500},
      {eID: 3, amt: 6, interval: 170, cR: 500},
      {eID: 3, amt: 9, interval: 160, cR: 500},
      {eID: 2, amt: 15, interval: 150, cR: 500},
      {eID: 4, amt: 5, interval: 200, cR: 500},
      {eID: 4, amt: 9, interval: 170, cR: 500},
      {eID: 9, amt: 6, interval: 150, cR: 500},
      {eID: 5, amt: 10, interval: 150, cR: 500},
      {eID: 4, amt: 25, interval: 50, cR: 500},
      {eID: 5, amt: 20, interval: 100, cR: 500},
      {eID: 3, amt: 40, interval: 40, cR: 500},
      {eID: 6, amt: 1, interval: 500, cR: 500},
      {eID: 7, amt: 20, interval: 70, cR: 500},
      {eID: 8, amt: 1, interval: 500, cR: 500},
  ];
  var waveInterval = 0;
  var waveAmt = 0;
  var diff = 1;


  var text2 = function(txt, x, y){
      fill(0, 0, 0);
      text(txt, x, y);
      fill(168, 168, 168);
      text(txt, x+2, y+1);
  };
  var button = function(e){
      this.txtX = 250;
      this.DOTHIS = e;
      this.t = false;
  };
  button.prototype.draw = function(x, y, h, c){
      if(this.t){
          this.DOTHIS();
          if(frameCount > 255/2){
              this.t = false;
          }
      }

      rectMode(CENTER);
      this.topBorder = (y + (h / 2));
      this.bottomBorder = (y - (h / 2));
      if(mouseY < this.topBorder && mouseY > this.bottomBorder){
          if(mp){
              this.t = true;
          }
          if(this.txtX > 5){
              this.txtX /= 1.25;
          }
      }else if(this.txtX < 220){
          this.txtX *= 1.125;
      }else{
          this.txtX = 255;
      }
      noStroke();
      fill(0, 0, 0, (255 - this.txtX));
      rect(x, y, 800, h*1.1);
      textSize(h);
      text2(c, x, y);
      fill(255, 255, 255, (255 - this.txtX));
      text(">[", x - this.txtX*1.1 - c.length*h/2, y);
      text("]<", x + this.txtX*1.1 + c.length*h/2, y);
  };
  var Play = new button(function(){state = 3;});
  var Opt = new button(function(){state = 2;});
  var BackToMenu = new button(function(){state = 1;});
  var Easy = new button(function(){diff = 0.8;});
  var Normal = new button(function(){diff = 1;});
  var Hard = new button(function(){diff = 1.2;});
  var Insa = new button(function(){diff = 1.5;});
  var NoFu = new button(function(){diff = 3;});
  var Menu = new button(function(){state = 1;
  money = 1000;life = 25;wave = 0;buildMode = null;paused = true;gmap=[];for(var i = 0; i < 11; i ++){gmap.push([]);for(var j = 0; j < 11; j ++){gmap[i].push([]);}} enemies=[];bullets=[];});

  //Credit: https://processing.org/examples/regularpolygon.html
  var Polygon = function(x, y, radius, npoints){
      var angle = (TWO_PI / npoints);
      beginShape();
      for (var a = 0; a < (TWO_PI); a += angle) {
          var sx = x + cos(a) * radius;
          var sy = y + sin(a) * radius;
          vertex(sx, sy);
      }
      endShape(CLOSE);
  };
  var Enemy = function(id){
      this.x = -25;
      this.y = 75;
      this.ax = 0;
      this.ay = 0;
      this.r = 0;
      this.id = id;
      this.def = edata.def[id];
      this.hp = edata.hp[id]*diff;
      this.rProg = 0;
      this.rStage = 0;
      this.lastHit = frameCount;
  };
  Enemy.prototype.draw = function(){
      this.r += edata.speed[this.id]*2;
      this.ax = x;
      this.ay = y;
      pushMatrix();
      translate(this.x, this.y);
      pushMatrix();
      rotate((radians(this.r)));
      switch(this.id){
          case 0:
              strokeWeight(8);
              stroke(255, 74, 74);
              fill(255, 125, 110);
              Polygon(0, 0, 20, 3);
              break;
          case 1:
              strokeWeight(8);
              stroke(255, 196, 0);
              fill(255, 230, 0);
              Polygon(0, 0, 25, 4);
              break;
          case 2:
              strokeWeight(8);
              stroke(100, 76, 255);
              fill(114, 112, 255);
              Polygon(0, 0, 25, 5);
              break;
          case 3:
              strokeWeight(8);
              stroke(76, 255, 94);
              fill(112, 255, 131);
              Polygon(0, 0, 28, 6);
              break;
          case 4:
              strokeWeight(6);
              stroke(255, 76, 246);
              fill(255, 112, 248);
              Polygon(0, 0, 15, 3);
              break;
          case 5:
              strokeWeight(8);
              stroke(76, 237, 255);
              fill(112, 255, 250);
              Polygon(0, 0, 30, 8);
              break;
          case 6:
              strokeWeight(8);
              stroke(255, 177, 76);
              fill(255, 193, 112);
              ellipse(0, 0, 65, 65);
              break;
      }
      popMatrix();
      if((this.lastHit+250) > frameCount){
          stroke(255, 255, 255, 5*(100+this.lastHit-frameCount));
          strokeWeight(1);
          fill(146+200*(this.hp/edata.hp[this.id]), 252*(this.hp/edata.hp[this.id]), 138*(this.hp/edata.hp[this.id]), 5*(100+this.lastHit-frameCount));
          rect(0, -25, 38*(this.hp/edata.hp[this.id])/diff, 3, 5);
          fill(31, 31, 31, 5*(100+this.lastHit-frameCount));
          text(this.hp, 0, -25);
      }
      popMatrix();
      if(this.rProg < 50){
          this.rProg += edata.speed[this.id];
          switch(route[this.rStage]){
              case "R": this.x += edata.speed[this.id]; break;
              case "L": this.x -= edata.speed[this.id]; break;
              case "U": this.y -= edata.speed[this.id]; break;
              case "D": this.y += edata.speed[this.id]; break;
          }
      }else{
          switch(route[this.rStage]){
              case "R": this.x += (50-this.rProg); break;
              case "L": this.x -= (50-this.rProg); break;
              case "U": this.y -= (50-this.rProg); break;
              case "D": this.y += (50-this.rProg); break;
          }
          this.rProg = 0;
          this.rStage ++;
      }
  };
  var Bullet = function(x, y, a, v, dmg, pier, tl){
      this.x = x;
      this.y = y;
      this.a = a;
      this.v = v;
      this.dmg = dmg;
      this.pierce = pier;
      this.dura = (tl/v)*1.5;
  };
  var Turret = function(id){
      this.id = id;
      this.reload = 0;
  };
  Turret.prototype.draw = function(x, y) {
      for(var k = 0; k < enemies.length; k ++){
          if(dist(enemies[k].x, enemies[k].y, x, y) < tdata.range[this.id]*1.5){
              var TH = atan2(enemies[k].y-y, enemies[k].x-x);
              rotate(TH+HALF_PI);
              if(this.reload > tdata.rof[this.id]){
                  this.reload = 0;
                  bullets.push(new Bullet(x, y, TH + radians(random(-tdata.accu[this.id], tdata.accu[this.id])), tdata.speed[this.id], tdata.dmg[this.id], tdata.pierce[this.id], tdata.range[this.id]));
              }
              break;
          }
      }
      this.reload ++;
      if(this.id < 4){
          fill(204, 247, 255);
      }else{
          fill(168, 243, 255);
      }
      ellipse(0, 0, 40, 40);
      pushMatrix();
      translate(0, -10*min(1, this.reload/tdata.speed[this.id]));
      switch(this.id){
          case 0:
              rect(0, -12, 20, 12);
              break;
          case 1:
              rect(-7, -15, 10, 17);
              rect(7, -15, 10, 17);
              break;
          case 2:
              quad(-6, -8, 6, -8, 10, -20, -10, -20);
              break;
          case 3:
              quad(-7, -8, 7, -8, 5, -35, -5, -35);
              break;
          case 4:
              rect(0, -12, 20, 12);
              rect(0, -17, 10, 12);
              break;
          case 5:
              rect(-10, -13, 8, 18);
              rect(0, -15, 8, 22);
              rect(10, -13, 8, 18);
              break;
          case 6:
              quad(-7, -8, 7, -8, 12, -24, -12, -24);
              break;
          case 7:
              quad(-6, -8, 6, -8, 4, -40, -4, -40);
              quad(-10, -8, 10, -8, 4, -20, -4, -20);
              break;
      }
      popMatrix();
  };
  var mouseClicked = function(){
      mp = true;
  };
  for(var i = 0; i < 11; i ++){
      gmap.push([]);
      for(var j = 0; j < 11; j ++){
          gmap[i].push([]);
      }
  }
  var draw = function(){
      switch(state){
          case 1:
              background(191, 191, 191);
              fill(255, 255, 255);
              textSize(30);
              text2("~6 Hour Hackathon~\n\nA Minimalistic, Generic\nTower Defense", 400, 200);
              Play.draw(400, 350, 70, "BEGIN");
              Opt.draw(400, 420, 40, "settings");
              break;
          case 2:
              background(227, 227, 227);
              textSize(45);
              text2("Change Difficulty", 400, 100);
              Easy.draw(400, 200, 35, (diff === 0.8) ? "[Easy]" : "Easy");
              Normal.draw(400, 250, 35, (diff === 1) ? "[Normal]" : "Normal");
              Hard.draw(400, 300, 35, (diff === 1.2) ? "[Hard]" : "Hard");
              Insa.draw(400, 350, 35, (diff === 1.5) ? "[Insane]" : "Insane");
              NoFu.draw(400, 400, 35, (diff === 3) ? "[Unfair]" : "Unfair");
              BackToMenu.draw(400, 500, 40, "back");
              break;
          case 3:
              background(212, 212, 212);
              x = 0;
              y = 0;
              for(var i = 0; i < route.length; i ++){
                  switch(route[i]){
                      case "R": x += 50; break;
                      case "L": x -= 50; break;
                      case "U": y -= 50; break;
                      case "D": y += 50; break;
                  }
                  fill(186, 186, 186);
                  rect(x-25, y+75, 50, 50);
              }
              fill(179, 179, 179);
              strokeWeight(4);
              stroke(156, 156, 156);
              for(var i = bullets.length-1; i >= 0; i --){
                  bullets[i].x += cos(bullets[i].a) * bullets[i].v;
                  bullets[i].y += sin(bullets[i].a) * bullets[i].v;
                  ellipse(bullets[i].x, bullets[i].y, min(bullets[i].dmg, 20), min(bullets[i].dmg, 20));
                  bullets[i].dura --;
                  if(bullets[i].dura <= 0){
                      bullets.splice(i, 1);
                      continue;
                  }
                  for(var j = 0; j < enemies.length; j ++){
                      if(dist(enemies[j].x, enemies[j].y, bullets[i].x, bullets[i].y) < 25){
                          enemies[j].hp -= max(0, bullets[i].dmg - enemies[j].def);
                          enemies[j].lastHit = frameCount;
                          bullets[i].pierce --;
                          if(bullets[i].pierce < 1){
                              break;
                          }
                          if(enemies[j].hp <= 0){
                              continue;
                          }
                      }
                  }
                  if(bullets[i].pierce < 1){
                      bullets.splice(i, 1);
                  }
              }
              textSize(12);
              for(var i = enemies.length-1; i >= 0; i --){
                  if(enemies[i].hp <= 0 || enemies[i].rStage > route.length-1){
                      if(enemies[i].hp > 0){
                          life --;
                      }else{
                          money += edata.reward[enemies[i].id];
                      }
                      enemies.splice(i, 1);
                      continue;
                  }
                  enemies[i].draw();
              }
              noStroke();
              for(var i = 0; i < gmap.length; i ++){
                  for(var j = 0; j < gmap[i].length; j ++){
                      if(gmap[i][j] === 0){
                          continue;
                      }
                      if(buildMode !== null && abs(mouseY-(i*50+25)) < 25 && abs(mouseX-(j*50+25)) < 25 && gmap[i][j] === 9){
                          if(tdata.cost[buildMode] <= money){
                              fill(130, 130, 130);
                              rect(j*50+25, i*50+25, 40, 40);
                              fill(0, 0, 0, 50);
                              ellipse(j*50+25, i*50+25, tdata.range[buildMode]*3, tdata.range[buildMode]*3);
                              if(mp){
                                  gmap[i][j] = new Turret(buildMode);
                                  money -= tdata.cost[buildMode];
                              }
                          }else{
                              buildMode = null;
                          }
                      }
                      if(isNaN(gmap[i][j])){
                          pushMatrix();
                          translate(j*50+25, i*50+25);
                          gmap[i][j].draw(j*50+25, i*50+25);
                          if(abs(mouseY-(i*50+25)) < 25 && abs(mouseX-(j*50+25)) < 25){
                                fill(0, 0, 0, 10);
                                ellipse(0, 0, tdata.range[gmap[i][j].id]*3, tdata.range[gmap[i][j].id]*3);
                                if(buildMode === null && gmap[i][j].id < 4){
                                    fill(250, 170, 170);
                                    if(money >= tdata.cost[gmap[i][j].id+4]){
                                        fill(181, 181, 181);
                                            if(mp){
                                                money -= tdata.cost[gmap[i][j].id+4];
                                                var newID = gmap[i][j].id+4;
                                                gmap[i][j] = new Turret(newID);
                                            }
                                    }
                                    ellipse(0, 0, 40, 40);
                                    fill(0, 0, 0, 40);
                                    ellipse(0, 0, tdata.range[gmap[i][j].id+4]*3, tdata.range[gmap[i][j].id+4]*3);
                                    fill(0, 0, 0);
                                    text("Upgrade to\n" + tdata.name[gmap[i][j].id+4] + "?\n$ " + tdata.cost[gmap[i][j].id+4], 0, 0 );
                                }
                            }
                          popMatrix();
                      }
                  }
              }
              resetMatrix();
              noStroke();
              fill(255, 255, 255);
              rect(675, 300, 250, 600);
              textSize(25);
              textAlign(RIGHT, CENTER);
              fill(41, 117, 0);
              text("$ " + money, 740, 40);
              fill(9, 166, 0);
              text("$ " + money, 740, 42);
              fill(115, 0, 0);
              text("HP " + life, 740, 70);
              fill(166, 0, 0);
              text("HP " + life, 740, 72);
              fill(0, 4, 115);
              text("WAVE " + wave, 740, 100);
              fill(0, 111, 166);
              text("WAVE " + wave, 740, 102);
              textAlign(CENTER, CENTER);
              waveInterval ++;
              if(waveInterval > waves[wave].interval && waveAmt < waves[wave].amt){
                  waveInterval = 0;
                  waveAmt ++;
                  enemies.push(new Enemy(waves[wave].eID));
              }
              for(var i = 0; i < 6; i ++){
                  if(i < 4){
                      textSize(12);
                      if(money >= tdata.cost[i]){
                          fill(180, 250, 190);
                      }else{
                          fill(250, 170, 170);
                      }
                  }else{
                      fill(130, 130, 130);
                        if(i === 4){
                            if(waveAmt >= waves[wave].amt && enemies.length < 1){
                                fill(150, 255, 245);
                            }else{
                                fill(250, 170, 170);
                            }
                        }
                  }
                  rect(670, 180 + i*75, 200, 60);
                  if(buildMode === i){
                      fill(0, 0, 0, 100);
                      rect(670, 180 + i*75, 200, 60);
                  }
                  if(abs(mouseX - 670) < 100 && abs(mouseY - (i*75)-180) < 30){
                      fill(0, 0, 0, 100);
                      rect(670, 180 + i*75, 200, 60);
                      if(i < 4){
                          fill(255, 255, 255, 150);
                          rect(450, 180 + i*75, 200, 60);
                          fill(0, 0, 0);
                          text(tdata.desc[i], 450, 180 + i*75);
                      }
                      if(i === 4){
                      fill(255, 255, 255, 150);
                      rect(450, 180 + i*75, 200, 60);
                      fill(0, 0, 0);
                          if(waveAmt >= waves[wave].amt && enemies.length < 1){
                              text("Next\n" + waves[wave+1].amt + "x " + edata.name[waves[wave+1].eID], 450, 180 + i*75);
                          }else{
                              text("Current\n" + waveAmt + "/" + waves[wave].amt + " " + edata.name[waves[wave+1].eID], 450, 180 + i*75);
                          }
                      }
                      if(mp){
                          if(i < 4){
                              buildMode = (i === buildMode) ? null : i;
                          }
                          if(i === 4){
                              if(waveAmt >= waves[wave].amt && enemies.length < 1){
                                  wave ++;
                                  waveInterval = 10000;
                                  waveAmt = 0;
                              }
                          }
                          if(i === 5){
                              paused = true;
                          }
                      }
                  }
                  fill(0, 0, 0);
                  if(i < 4){
                      text(tdata.name[i]+" Turret\n$ "+tdata.cost[i]+"\n"+floor(tdata.dmg[i]/tdata.rof[i]*tdata.pierce[i]*60)+"DPS", 670, 180 + i*75);
                  }else if(i === 4){
                      textSize(24);
                      text2("Next Wave", 670, 480);
                  }else{
                      text2("Pause", 670, 555);
                  }
              }if(life <= 0){
                state = 7;
            }
            if(wave >= waves.length-1){
                state = 6;
            }
              if(paused){
                  state = 4;
              }
              break;
          case 4:
              fill(0, 0, 0, 100);
              rect(0, 0, 9999, 9999);
              fill(255, 255, 255, 200);
              textSize(70);
              text("PAUSED", 400, 200);
              textSize(10);
              text("Click anywhere to unpause", 400, 250);
              text("Enemies are\ninvading from here.", 80, 70);
              text("They must first\ntravel through\nthe entire\nroute to attack.", 300, 300);
              text("If the enemies\nreach the end\nthey will\n the capital.", 500, 520);
              fill(255, 255, 255, 150);
              rect(670, 300, 150, 50);
              fill(0, 0, 0);
              text("Buy turrets to\nattack the enemies\nas they travel through\nthe route.", 670, 300);
              text("You gain money\nfrom killing enemies\nand completing waves\n\nFor each enemy\nwho reaches the end\nyou lose a life.", 550, 80);
              state = 5;
              break;
          case 5:
              if(mp){
                  paused = false;
                  state = 3;
                  frameCount --;
              }
              break;
          case 6:
                fill(9, 255, 0, 100);
                rect(0, 0, 9999, 9999);
                fill(255, 255, 255, 200);
                textSize(70);
                text("You win!", 400, 200);
                state = 8;
                break;
            case 7:
                fill(252, 5, 13, 100);
                rect(0, 0, 9999, 9999);
                fill(255, 255, 255, 200);
                textSize(70);
                text("You lose", 400, 200);
                state = 8;
                break;
            case 8:
                Menu.draw(400, 400, 35, "Try Again?");
                break;
      }
      resetMatrix();
      mp = false;
  };



}};
