const constWidth = 1200;
<<<<<<< HEAD
const constHeight = 700
var canvas;

var state;

const DO_NOTHING = 0;
const RESET = -1;
const CIRCLE_MODE = 1;
=======
const constHeight = 700;
>>>>>>> bc10de55608631c940d02528c56671d054affbe2

function setup(){
    canvas = createCanvas(constWidth, constHeight, WEBGL);
    canvas.parent("canvas");
    angleMode(DEGREES);
    frameRate(60);

    background('#1e1e1e');

    //default state
    state = DO_NOTHING
}

function draw(){
    if(state == DO_NOTHING){

    } else if(state == CIRCLE_MODE){

    }
}