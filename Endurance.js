//Run within https://www.khanacademy.org/cs/new/pjs

frameRate(0);

var _SLIDE = 1.1;
var _LASTING = 4;
var _ACCY = 4;
var _msT = 10 * _ACCY;

var keys = [];
var c = 0;
var a = 0;
var w = 0;
var l = 0;
var t = 0;
var o = 0;
var C = 0;
var mark = createGraphics(300, 40, P2D);
mark.rectMode(CENTER);
rectMode(CENTER);
mark.noStroke();
noStroke();

textAlign(CENTER, CENTER);

var keyPressed = function(){
    if(keys[keyCode]){
        return;
    }
    keys[keyCode] = 10;
    if(!l){ l = millis(); }
    if(abs(keyCode-89) === 1){
        w ++;
        o = (millis() - l) - t;
        a += ((millis() - l) - a) / w;
        if(w > 50){
            mark.fill(255, 255, 255);
            mark.rect(constrain(150 + ((millis() - l) - t) / _ACCY, 0, 300), 15, 5, 30);
            C ++;
        }
        l = millis();
    }
};
var keyReleased = function(){
    keys[keyCode] = 0;
};

var draw = function() {
    fill(0, 0, 0, 20);
    rect(-1, -1, 9999, 9999);
    fill(255, 255, 255);
    textSize(25);
    text("\n" + C+"x", 200, 200);
    for(var i = 88; i <= 90; i += 2){
        textSize(keys[i] + 15);
        pushMatrix();
        translate(200 - (i-89)*100, 300 + keys[i]);
        rotate(keys[i]*3 * (w%2-0.5)/0.5);
        text(String.fromCharCode(i), 0, 0);
        popMatrix();
        keys[i] /= _SLIDE;
    }
    if(w > 50){
        textSize(20 - min((millis() - l) / (a/log(a)), 2));
        var M = "";
        switch(true){
            case abs(o) < _msT/2: M = "EXCELLENT"; break;
            case abs(o) < _msT: M = "GREAT"; break;
            case abs(o) < _msT*3: M = "GOOD"; break;
            case abs(o) < _msT*6: M = "BAD"; break;
            default: M = "MISS"; C = 0;
        }
        text(M, 200, 100);
        textSize(12);
        text(abs(o) > _msT ? (o > 0 ? "Late" : "Early") + " by " + ~~abs(o) + "ms" : "", 200, 120);
    }
    switch(true){
        case w < 50:
            textSize(20);
            text("Calculating SPEED" + "...".substr(0, w % 4) + "\nestimated BPM: " + ~~(60000 / a / 4), 200, 100);
            break;
        case w === 50:
            t = ~~a;
            w ++;
            mark.fill(255, 136, 0);
            mark.rect(0, 20, 210, 40);
            mark.rect(300, 20, 210, 40);
            mark.fill(21, 255, 0);
            mark.rect(125, 20, 40, 40);
            mark.rect(175, 20, 40, 40);
            mark.fill(0, 255, 255);
            mark.rect(150, 20, 20, 40);
            break;
        default:
        if(frameCount % 10 === 0){
            mark.fill(255, 173, 79, _LASTING);
            mark.rect(0, 20, 210, 40);
            mark.rect(300, 20, 210, 40);
            mark.fill(182, 255, 99, _LASTING);
            mark.rect(125, 20, 40, 40);
            mark.rect(175, 20, 40, 40);
            mark.fill(0, 255, 255, _LASTING);
            mark.rect(150, 20, 20, 40);
        }
        image(mark.get(), 50, 380);
        if(C < 40){
            fill(0, 0, 0, 100 - C*2.5);
            rect(constrain(150 + ((millis() - l) - t) / _ACCY, 0, 300) + 50, 395, 5, 30);
            rect(constrain(150 - ((millis() - l) - t) / _ACCY, 0, 300) + 50, 395, 5, 30);
        }
    }
    textSize(10);
    text(~~this.__frameRate + "FPS", 380, 10);
};
