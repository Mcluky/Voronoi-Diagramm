const constWidth = 1200;
const constHeight = 700
var canvas;

var state;
var currentRadius;
var isSetup;

const DO_NOTHING = 0;
const RESET = -1;
const CIRCLE_MODE = 1;


function setup() {
    isSetup = true;
    canvas = createCanvas(constWidth, constHeight);
    canvas.parent("canvas");
    angleMode(DEGREES);
    frameRate(60);

    background('#1e1e1e');

    currentRadius = 1;

    //DrawCirle(300, 300, 100);

    //default state
    state = DO_NOTHING
}

function draw() {
    stroke(200);
    point(mouseX, mouseY);
    DrawCirle(300, 300, 100);

    //ellipse(mouseX, mouseY, 80, 80);
    if (state == DO_NOTHING) {

    } else if (state == CIRCLE_MODE) {
        isSetup = false;
        if (currentRadius <= 800 && CIRCLE_MODE == 1) {
            currentRadius += 1;
            DrawCirle1(600, 350, currentRadius);
        } else {
            currentRadius = 1;
            setup();

        }
    } else if (state == RESET) {
        state = DO_NOTHING;
        setup();
    }
}

var DrawCirle1 = function (x0, y0, radius) {
    var x = radius;
    var y = 0;
    var radiusError = 1 - x;

    while (x >= y) {
        point(x + x0, y + y0);
        point(x + x0, y + y0 + 1);
        point(x + x0, y + y0 - 1);
        point(x + x0 - 1, y + y0);
        point(x + x0 + 1, y + y0);

        point(y + x0, x + y0);
        point(y + x0, x + y0 + 1);
        point(y + x0, x + y0 - 1);
        point(y + x0 + 1, x + y0);
        point(y + x0 - 1, x + y0);

        point(-x + x0, y + y0);
        point(-x + x0, y + y0 + 1);
        point(-x + x0, y + y0 - 1);
        point(-x + x0 + 1, y + y0);
        point(-x + x0 - 1, y + y0);

        point(-y + x0, x + y0);
        point(-y + x0, x + y0 + 1);
        point(-y + x0, x + y0 - 1);
        point(-y + x0 + 1, x + y0);
        point(-y + x0 - 1, x + y0);

        point(-x + x0, -y + y0);
        point(-x + x0, -y + y0 + 1);
        point(-x + x0, -y + y0 - 1);
        point(-x + x0 + 1, -y + y0);
        point(-x + x0 - 1, -y + y0);

        point(-y + x0, -x + y0);
        point(-y + x0, -x + y0 + 1);
        point(-y + x0, -x + y0 - 1);
        point(-y + x0 + 1, -x + y0);
        point(-y + x0 - 1, -x + y0);

        point(x + x0, -y + y0);
        point(x + x0, -y + y0 + 1);
        point(x + x0, -y + y0 - 1);
        point(x + x0 + 1, -y + y0);
        point(x + x0 - 1, -y + y0);

        point(y + x0, -x + y0);
        point(y + x0, -x + y0 + 1);
        point(y + x0, -x + y0 - 1);
        point(y + x0 + 1, -x + y0);
        point(y + x0 - 1, -x + y0);

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

