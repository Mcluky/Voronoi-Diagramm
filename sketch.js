const constWidth = 1200;
const constHeight = 700
var canvas;

var state;
var currentRadius;
var isSetup;
var finished;
var amountPoints;
var points;

const DO_NOTHING = 0;
const GENERATE_POINTS = -2;
const RESET = -1;
const CIRCLE_MODE = 1;


function setup() {
    isSetup = true;
    stopCounter = 0;
    finished = false;
    if(!amountPoints){
        //default value amount points
        amountPoints = 10;
    }

    canvas = createCanvas(constWidth, constHeight);
    canvas.parent("canvas");
    angleMode(DEGREES);
    frameRate(60);

    background('#1e1e1e');

    currentRadius = 0;

    //DrawCirle(300, 300, 150);
    //default state
    state = GENERATE_POINTS
}

function draw() {
    background('#1e1e1e');
    var fps = frameRate();
    stroke(255);
    text("FPS: " + fps.toFixed(2), 10, height - 10);

    //point(mouseX, mouseY);
    //DrawCirle(300, 300, 100);

    //ellipse(mouseX, mouseY, 80, 80);
    if (state == DO_NOTHING) {

    } else if(state == GENERATE_POINTS){

    } else if (state == CIRCLE_MODE) {
        isSetup = false;
        circleModeFun();
    } else if (state == RESET) {
        state = DO_NOTHING;
        setup();
    }
}

function circleModeFun(){
    if (currentRadius <= 2000 && CIRCLE_MODE == 1) {
            

        //DrawCirle(600, 350, currentRadius);
        //currentRadius += 1;
        
        DrawCirle(600, 150, currentRadius);
        DrawCirle(600, 550, currentRadius);
        DrawCirle(400, 350, currentRadius);
        DrawCirle(800, 350, currentRadius);
        DrawCirle(400, 150, currentRadius);
        DrawCirle(400, 550, currentRadius);
        DrawCirle(800, 550, currentRadius);
        DrawCirle(800, 150, currentRadius);
        currentRadius += 1;
        
    } else {
        currentRadius = 1;
        finish();
        //setup();

    }
}

function finish(){
    finished = true;
    state = DO_NOTHING;
}

var DrawCirle = function (x0, y0, radius) {
    stroke(radius % 255);

    //point(x0, y0);

    var x = radius;
    var y = 0;
    var radiusError = 1 - x;

    while (x >= y) {
        point(x + x0, y + y0);
        point(x + x0, y + y0 + 1);
        //point(x + x0, y + y0 - 1);
        //point(x + x0 - 1, y + y0);
        point(x + x0 + 1, y + y0);

        point(y + x0, x + y0);
        point(y + x0, x + y0 + 1);
        //point(y + x0, x + y0 - 1);
        point(y + x0 + 1, x + y0);
        //point(y + x0 - 1, x + y0);

        point(-x + x0, y + y0);
        point(-x + x0, y + y0 + 1);
        //point(-x + x0, y + y0 - 1);
        //point(-x + x0 + 1, y + y0);
        point(-x + x0 - 1, y + y0);

        point(-y + x0, x + y0);
        point(-y + x0, x + y0 + 1);
        //point(-y + x0, x + y0 - 1);
        //point(-y + x0 + 1, x + y0);
        point(-y + x0 - 1, x + y0);

        point(-x + x0, -y + y0);
        //point(-x + x0, -y + y0 + 1);
        point(-x + x0, -y + y0 - 1);
        //point(-x + x0 + 1, -y + y0);
        point(-x + x0 - 1, -y + y0);

        point(-y + x0, -x + y0);
        //point(-y + x0, -x + y0 + 1);
        point(-y + x0, -x + y0 - 1);
        //point(-y + x0 + 1, -x + y0);
        point(-y + x0 - 1, -x + y0);

        point(x + x0, -y + y0);
        //point(x + x0, -y + y0 + 1);
        point(x + x0, -y + y0 - 1);
        point(x + x0 + 1, -y + y0);
        //point(x + x0 - 1, -y + y0);

        point(y + x0, -x + y0);
        //point(y + x0, -x + y0 + 1);
        point(y + x0, -x + y0 - 1);
        point(y + x0 + 1, -x + y0);
        //point(y + x0 - 1, -x + y0);
        y++;

        if (radiusError < 0) {
            radiusError += 2 * y + 1;
        }
        else {
            x--;
            radiusError += 2 * (y - x + 1);
        }
    }
};

