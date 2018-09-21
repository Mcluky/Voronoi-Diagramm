const constWidth = 1200;
const constHeight = 700
var canvas;

var state;
var currentRadius;
var isSetup;
var finished;
var amountCircles;
var circles = [];
var pxlArray;

const DO_NOTHING = 0;
const DRAW_RANDOM_POINTS = -3;
const GENERATE_POINTS = -2;
const RESET = -1;
const CIRCLE_MODE = 1;

const PXL_STATE_EMPTY = 0;
const PIXEL_COLOR= "1e1e1e";
const PIXEL_BORDER_COLOR = "fffff";
const PXL_STATE_BORDER = -1;

function setup() {
    isSetup = true;
    stopCounter = 0;
    finished = false;

    pxlArray = createPxlArray(constWidth, constHeight);
    for(x=0; x<constWidth; x++){
        for(y=0; y<constWidth; y++){
            pxlArray[x][y] = new Pixel(PXL_STATE_EMPTY, PIXEL_COLOR)
        }
    }

    canvas = createCanvas(constWidth, constHeight);
    canvas.parent("canvas");
    angleMode(DEGREES);
    frameRate(60);

    background('#1e1e1e');

    currentRadius = 0;

    if (!amountCircles) {
        //default value amount points
        amountCircles = 10;
        state = GENERATE_POINTS
    } else {
        state = DRAW_RANDOM_POINTS
    }
}

function draw() {
    var fps = frameRate();

    //point(mouseX, mouseY);
    //DrawCirle(300, 300, 100);

    //ellipse(mouseX, mouseY, 80, 80);
    if (state == DO_NOTHING) {

    } else if (state == GENERATE_POINTS) {
        generateCirclesFun();
    } else if (state == CIRCLE_MODE) {
        isSetup = false;
        circleModeFun();
    } else if (state == RESET) {
        state = DO_NOTHING;
        setup();
    } else if (state == DRAW_RANDOM_POINTS) {
        background('#1e1e1e');
        console.log("draw random points");
        for (var i = 0; i < circles.length; i++) {
            point(circles[i].x, circles[i].y);
        }
        state = DO_NOTHING;
    }
    stroke(255);
    text("FPS: " + fps.toFixed(2) + " / 60.00", 10, height - 10);
}

function generateCirclesFun() {
    circles = [];
    for (var i = 0; i < amountCircles; i++) {
        var circle = {
            'x': Math.floor((Math.random() * constWidth) + 0),
            'y': Math.floor((Math.random() * constHeight) + 0)
        }
        circles.push(circle);
    }
    state = DRAW_RANDOM_POINTS;
}

function circleModeFun() {
    background('#1e1e1e');
    if (currentRadius <= constHeight && CIRCLE_MODE == 1) {

        for (var i = 0; i < circles.length; i++) {
            DrawCirle(circles[i].x, circles[i].y, currentRadius);
        }

        //DrawCirle(600, 350, currentRadius);
        //currentRadius += 1;
/*
        DrawCirle(600, 150, currentRadius);
        DrawCirle(600, 550, currentRadius);
        DrawCirle(400, 350, currentRadius);
        DrawCirle(800, 350, currentRadius);
        DrawCirle(400, 150, currentRadius);
        DrawCirle(400, 550, currentRadius);
        DrawCirle(800, 550, currentRadius);
        DrawCirle(800, 150, currentRadius);
*/

        currentRadius += 1;

    } else {
        currentRadius = 1;
        finish();
        //setup();
    }
}

function finish() {
    finished = true;
    state = DO_NOTHING;
}

var DrawCirle = function (x0, y0, radius) {

    stroke(255);
    //point(x0, y0);

    var x = radius;
    var y = 0;
    var radiusError = 1 - x;

    while (x >= y) {
        point(x + x0, y + y0);
        point(x + x0 + 1, y + y0);

        point(y + x0, x + y0);
        point(y + x0 + 1, x + y0);

        point(-x + x0, y + y0);
        point(-x + x0 - 1, y + y0);

        point(-y + x0, x + y0);
        point(-y + x0 - 1, x + y0);

        point(-x + x0, -y + y0);
        point(-x + x0 - 1, -y + y0);

        point(-y + x0, -x + y0);
        point(-y + x0 - 1, -x + y0);

        point(x + x0, -y + y0);
        point(x + x0 + 1, -y + y0);

        point(y + x0, -x + y0);
        point(y + x0 + 1, -x + y0);
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

function createPxlArray(length) {
    var arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createPxlArray.apply(this, args);
    }
    return arr;
}
