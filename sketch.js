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
var finishedAlgo;
//How many circles should be generated. Is set in the UI
var amountCircles;

//The Circle array contain all Circle objects
var circles = [];
//The virtual Pixel array. Contains all Pixel objects
var pxlArray;
//The BorderPixel array contains all BorderPixel objects 
var borderPxl = [];

//The different pixel states
//Default Pixel state. Pixel is empty and not set.
const PXL_STATE_EMPTY = 0;
//Pixel border state. Pixel is set as border.
const PXL_STATE_BORDER = -1;

//Default Pixel color (same as background color)
const DEFAULT_PXL_COLOR = "1e1e1e";
const DEFAULT_PXL_COLOR_RGB = hexToRgb(DEFAULT_PXL_COLOR);

//The Border Pixel color
const BORDER_PXL_COLOR = "ff0000";
const BORDER_PXL_COLOR_RGB = hexToRgb(BORDER_PXL_COLOR);

//The active Pixel color
const PIXEL_ACTIVE_COLOR = "ffffff";
const PIXEL_ACTIVE_COLOR_RGB = hexToRgb(PIXEL_ACTIVE_COLOR);

//function of p5js. Setup the program. Is executed on page load
function setup() {
    finishedAlgo = false;
    //Clear or create borderPxl array
    borderPxl = [];
    //function of p5js. Set the pixel density for the canvas
    //lower -> more blurry but faster, higher -> sharper but slower
    //! Code works only with value 1!
    pixelDensity(1);

    //create the virtual Pixel array 
    pxlArray = createPxlArray(constWidth, constHeight);
    //create all Pixel objects and set all default values for every pixel
    for (x = 0; x < constWidth; x++) {
        for (y = 0; y < constWidth; y++) {
            pxlArray[x][y] = new Pixel(PXL_STATE_EMPTY, DEFAULT_PXL_COLOR)
        }
    }

    //function of p5js. Set up canvas for "drawing"
    canvas = createCanvas(constWidth, constHeight);
    canvas.parent("canvas");
    angleMode(DEGREES);
    //function of p5js. Set framerate (normally 60fps, most displays are only capable of showing <= 60) 
    //higher -> faster, lower -> slower
    frameRate(60);
    
    //function of p5js. paints entire canvas in this color
    background('#1e1e1e');

    //set the current circle radius to 0 
    currentRadius = 0;

    //If the page is loaded the first time, amountCircles is undefined. On first load, the circles must be generated. Later, they can just be drawn again
    if (!amountCircles) {
        //default value amount Circles
        amountCircles = 10;
        //generate circles
        state = GENERATE_CIRCLES
    } else {
        //draw circles points
        state = DRAW_CIRCLES
    }
    //Algorithm is ready
    isSetup = true;
}

//function of p5js. This function gets repeatedly called after the setup function
function draw() {
    // The main state machine
    if (state == DO_NOTHING) {
        //do nothing -> The Canvas will do nothing during this state
    } else if (state == GENERATE_CIRCLES) {
        //Generate new circle objects
        generateCirclesFun();
    } else if (state == CIRCLE_MODE) {
        //starts the algorithm in circle mode (circle that get bigger)
        isSetup = false;
        circleModeFun();
    } else if (state == RESET) {
        //Reset the entire algorithm to original state
        state = DO_NOTHING;
        setup();
    } else if (state == DRAW_CIRCLES) {
        //draw the center points of the circle on the canvas
        //function of p5js.
        background('#1e1e1e');
        console.log("draw random circles");
        //draw center points
        drawPoints();
        state = DO_NOTHING;
    }
}


//draw the center points of the circle on the canvas
function drawPoints() {
    //function of p5js. Saves the current options of the canvas
    push();
    //function of p5js. Sets the canvas to radius mode (All objects are drawn around the center point)
    rectMode(RADIUS);
    //draw small points for the circle
    for (var i = 0; i < circles.length; i++) {
        //function of p5js. Draws a small ellipse
        ellipse(circles[i].getCenterX(), circles[i].getCenterY(), 3, 3)
    }
    //function of p5js. Retrieve the old canvas options (set above)
    pop();
}

//Generate new circle objects with random center points
function generateCirclesFun() {
    circles = [];
    for (var i = 0; i < amountCircles; i++) {
        //Random center points and set default pixel color
        var circle = new Circle(Math.floor((Math.random() * constWidth) + 0), Math.floor((Math.random() * constHeight) + 0), 0, DEFAULT_PXL_COLOR);
        circles.push(circle);
    }
    //Draw the circles on the canvas that were just generated
    state = DRAW_CIRCLES;
}


//This algorithm tries to solve the issue using circles that get bigger and bigger. At some point the will 
//overlap each other. These intersection points are the border of the voronoi field. 
//For more information, consider reading the documentation.
function circleModeFun() {
    background('#1e1e1e');
    //function of p5js. It loads all displaying pixel from the canvas.
    loadPixels();
    //Internal flag if algorithm is finished
    //set temporarily to true. (Must be false if even one of the circles isn't)
    var finished = true;

    for (var i = 0; i < circles.length; i++) {
        if (!circles[i].surrounded) {
            //Internal flag if all pixels can't be set
            //set temporarily to true. (Must be false if even one of the pixel can be set)
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
        for (var i = 0; i < circles.length; i++) {
            circles[i].surrounded = false;
        }
        finish();
    }
    drawBorderPixel();
    updatePixels();
    drawPoints();

    currentRadius += 1;
}

var finish = function() {
    finishedAlgo = true;
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

var setPixelInArrayAndCanvas = function (x, y, pixelState, color, circle) {
    if (x >= 0 && x < constWidth && y >= 0 && y < constHeight) {
        var pxl = pxlArray[x][y];

        if ((pxl.getState() == pixelState) && pxl.getCircle() !== circle) {
            //detect if border Pixel
            pxl.setState(PXL_STATE_BORDER);
            pxl.setColor(BORDER_PXL_COLOR);
            pxl.setCircle(circle);

            borderPxl.push(new BorderPixel(x, y, PXL_STATE_BORDER, BORDER_PXL_COLOR));

            //if pixel can be set it's  not surrounded
            if (pxl.getCircle().surrounded) {
                pxl.getCircle().surrounded = false;
            }
        } else if (pxl.getState() == PXL_STATE_EMPTY) {
            //detect if Pixel emtpy
            pxl.setState(pixelState);
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