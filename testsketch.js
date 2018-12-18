//Voronoi diagram by Niklas van der Heide and Lukas Meili 
//Project for Applied Mathematics 2018

//Canvas size
const constWidth = 1200;
const constHeight = 700
//canvas object
var canvas;

//The current state of the state machine
var state;

//The different states for the state machine
//State for pausing the algorithm. 
const DO_NOTHING = 0;
//State for generating the circle objects with random center points
const GENERATE_CIRCLES = -2;
//State for drawing the center point of the circles
const DRAW_CIRCLES = -3;
const RESET = -1;
const CIRCLE_MODE = 1;

//Current radius for the circle 
var currentRadius;
//Flag if the program is set up (primarily only for the UI)
var isSetup;
//Flag if the algorithm is finished
var finished;
//How many circles should be generated. Is set in the UI
var amountCircles;

var circles = [];
var pxlArray;
var borderPxl = [];

const PXL_STATE_EMPTY = 0;
const STANDART_PXL_COLOR = "1e1e1e";
const STANDART_PXL_COLOR_RGB = hexToRgb(STANDART_PXL_COLOR);

const BORDER_PXL_COLOR = "ff0000";
const BORDER_PXL_COLOR_RGB = hexToRgb(BORDER_PXL_COLOR);

const PIXEL_ACTIVE_COLOR = "ffffff";
const PIXEL_ACTIVE_COLOR_RGB = hexToRgb(PIXEL_ACTIVE_COLOR);

const PXL_STATE_BORDER = -1;

function getCenterOfPoints(x1, y1, x2, y2){
    var xmiddle = (x1+x2)/2;
    var ymiddle = (y1+y2)/2;
    return [xmiddle, ymiddle];
}

function getIntersectionOfCircles(circle1, corcle2) {
    var a, dx, dy, d, h, rx, ry;
    var x2, y2;

    /* dx and dy are the vertical and horizontal distances between
     * the circle centers.
     */
    dx = corcle2.getCenterX() - circle1.getCenterX;
    dy = corcle2.getCenterY() - circle1.getCenterY;

    /* Determine the straight-line distance between the centers. */
    d = Math.sqrt((dy*dy) + (dx*dx));

    /* Check for solvability. */
    if (d > (circle1.getRadius()+ circle2.getRadius())) {
        /* no solution. circles do not intersect. */
        return false;
    }
    if (d < Math.abs(circle1.getRadius() - circle2.getRadius())) {
        /* no solution. one circle is contained in the other */
        return false;
    }

    /* 'point 2' is the point where the line through the circle
     * intersection points crosses the line between the circle
     * centers.  
     */

    /* Determine the distance from point 0 to point 2. */
    a = ((circle1.getRadius()*circle1.getRadius()) - (circle2.getRadius()*circle2.getRadius()) + (d*d)) / (2.0 * d) ;

    /* Determine the coordinates of point 2. */
    x2 = circle1.getCenterX() + (dx * a/d);
    y2 = circle1.getCenterY() + (dy * a/d);

    /* Determine the distance from point 2 to either of the
     * intersection points.
     */
    h = Math.sqrt((circle1.getRadius()*circle1.getRadius()) - (a*a));

    /* Now determine the offsets of the intersection points from
     * point 2.
     */
    rx = -dy * (h/d);
    ry = dx * (h/d);

    /* Determine the absolute intersection points. */
    var xi = x2 + rx;
    var xi_prime = x2 - rx;
    var yi = y2 + ry;
    var yi_prime = y2 - ry;

    return [xi, xi_prime, yi, yi_prime];

function setup() {
    isSetup = true;
    stopCounter = 0;
    finished = false;
    borderPxl = [];
    pixelDensity(1);

    pxlArray = createPxlArray(constWidth, constHeight);
    for (x = 0; x < constWidth; x++) {
        for (y = 0; y < constWidth; y++) {
            pxlArray[x][y] = new Pixel(PXL_STATE_EMPTY, STANDART_PXL_COLOR)
        }
    }

    canvas = createCanvas(constWidth, constHeight);
    canvas.parent("canvas");
    angleMode(DEGREES);
    frameRate(60);

    background('#1e1e1e');

    currentRadius = 0;

    if (!amountCircles) {
        //default value amount cirlces
        amountCircles = 10;
        state = GENERATE_CIRCLES
    } else {
        state = DRAW_CIRCLES
    }
}

function draw() {
    var fps = frameRate();

    //point(mouseX, mouseY);
    //DrawCirle(300, 300, 100);

    //ellipse(mouseX, mouseY, 80, 80);
    if (state == DO_NOTHING) {

    } else if (state == GENERATE_CIRCLES) {
        generateCirclesFun();
    } else if (state == CIRCLE_MODE) {
        isSetup = false;
        circleModeFun();
    } else if (state == RESET) {
        state = DO_NOTHING;
        setup();
    } else if (state == DRAW_CIRCLES) {
        background('#1e1e1e');
        console.log("draw random cirlces");
        drawPoints();
        state = DO_NOTHING;
    }
    stroke(255);
    text("FPS: " + fps.toFixed(2) + " / 60.00", 10, height - 10);
}



function drawPoints() {
    push();
    rectMode(RADIUS);
    for (var i = 0; i < circles.length; i++) {
        ellipse(circles[i].getCenterX(), circles[i].getCenterY(), 2, 2)
    }
    pop();
}


function generateCirclesFun() {
    circles = [];
    for (var i = 0; i < amountCircles; i++) {
        var cirlce = new Circle(Math.floor((Math.random() * constWidth) + 0), Math.floor((Math.random() * constHeight) + 0), 0, STANDART_PXL_COLOR);
        circles.push(cirlce);
    }
    state = DRAW_CIRCLES;
}



function circleModeFun() {
    background('#1e1e1e');
    loadPixels();
    var finished = true;
    for (var i = 0; i < circles.length; i++) {
        if (!circles[i].surrounded) {
            //set temporarly to true
            circles[i].surrounded = true;
            DrawCircleInArrayAndCanvas(circles[i].getCenterX(), circles[i].getCenterY(), currentRadius, circles[i].getColor(), circles[i]);
        }
        //detect if all circles are surrounded
        if (finished) {
            finished = circles[i].surrounded;
        }
    }
    //check if it's finished
    if (finished) {
        state = DO_NOTHING;
        for (var i = 0; i < circles.length; i++) {
            circles[i].surrounded = false;
        }
    }
    drawBorderPixel();
    updatePixels();
    drawPoints();

    currentRadius += 1;
}

function finish() {
    finished = true;
    state = DO_NOTHING;
}



var DrawCircleInArrayAndCanvas = function (x0, y0, radius, color, circle) {
    var x = radius;
    var y = 0;
    var radiusError = 1 - x;

    while (x >= y) {
        setPixelInArrayAndCanvas(x + x0, y + y0, radius, color, circle);
        setPixelInArrayAndCanvas(x + x0 + 1, y + y0, radius, color, circle);

        setPixelInArrayAndCanvas(y + x0, x + y0, radius, color, circle);
        setPixelInArrayAndCanvas(y + x0 + 1, x + y0, radius, color, circle);

        setPixelInArrayAndCanvas(-x + x0, y + y0, radius, color, circle);
        setPixelInArrayAndCanvas(-x + x0 - 1, y + y0, radius, color, circle);

        setPixelInArrayAndCanvas(-y + x0, x + y0, radius, color, circle);
        setPixelInArrayAndCanvas(-y + x0 - 1, x + y0, radius, color, circle);

        setPixelInArrayAndCanvas(-x + x0, -y + y0, radius, color, circle);
        setPixelInArrayAndCanvas(-x + x0 - 1, -y + y0, radius, color, circle);

        setPixelInArrayAndCanvas(-y + x0, -x + y0, radius, color, circle);
        setPixelInArrayAndCanvas(-y + x0 - 1, -x + y0, radius, color, circle);

        setPixelInArrayAndCanvas(x + x0, -y + y0, radius, color, circle);
        setPixelInArrayAndCanvas(x + x0 + 1, -y + y0, radius, color, circle);

        setPixelInArrayAndCanvas(y + x0, -x + y0, radius, color, circle);
        setPixelInArrayAndCanvas(y + x0 + 1, -x + y0, radius, color, circle);

        y++;

        if (radiusError < 0) {
            radiusError += 2 * y + 1;
        }
        else {
            x--;
            radiusError += 2 * (y - x + 1);
        }
    }
}

var setPixelInArrayAndCanvas = function (x, y, state, color, circle) {
    if (x >= 0 && x < constWidth && y >= 0 && y < constHeight) {
        var pxl = pxlArray[x][y];

        if ((pxl.getState() == state) && pxl.getCircle() !== circle) {
            //detect if border Pixel
            pxl.setState(PXL_STATE_BORDER);
            pxl.setColor(BORDER_PXL_COLOR);
            pxl.setCircle(circle);

            borderPxl.push(new BorderPixel(x, y, PXL_STATE_BORDER, BORDER_PXL_COLOR));

            //if pixel can be set it's  not sourrounded
            if (pxl.getCircle().surrounded) {
                pxl.getCircle().surrounded = false;
            }
        } else if (pxl.getState() == PXL_STATE_EMPTY) {
            //detect if Pixel emtpy
            pxl.setState(state);
            pxl.setColor(color);
            pxl.setCircle(circle);

            //active Pixels
            var index = ((x + y * constWidth) * 4);
            pixels[index] = PIXEL_ACTIVE_COLOR_RGB.r;
            pixels[index + 1] = PIXEL_ACTIVE_COLOR_RGB.g;
            pixels[index + 2] = PIXEL_ACTIVE_COLOR_RGB.b;
            pixels[index + 3] = 255;

            //if pixel cant be set because it's sourrounded
            if (pxl.getCircle().surrounded) {
                pxl.getCircle().surrounded = false;
            }
        }
    }
}

var drawBorderPixel = function () {
    for (var i = 0; i < borderPxl.length; i++) {
        var tmpBorderPxl = borderPxl[i];
        var borderPxlColor = hexToRgb(tmpBorderPxl.getColor());
        //set(tmpBorderPxl.getX(), tmpBorderPxl.getY(), tmpBorderPxl.getColor())

        var index = ((tmpBorderPxl.getX() + tmpBorderPxl.getY() * constWidth) * 4);
        pixels[index] = borderPxlColor.r;
        pixels[index + 1] = borderPxlColor.g;
        pixels[index + 2] = borderPxlColor.b;
        pixels[index + 3] = 255;

    }
    //updatePixels();
}

function createPxlArray(length) {
    var arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createPxlArray.apply(this, args);
    }
    return arr;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}