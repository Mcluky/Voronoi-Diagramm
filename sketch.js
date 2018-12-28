//Voronoi diagram by Niklas van der Heide and Lukas Meili
//Project for Applied Mathematics 2018

//Canvas size
const constWidth = 1200;
const constHeight = 700;
//canvas object
let canvas;

//The current state of the state machine
let state;

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
let currentRadius;
//Flag if the program is set up (primarily only for the UI)
let isSetup;
//Flag if the algorithm is finished
let finishedAlgo;
//How many circles should be generated. Is set in the UI
let amountCircles;

//The Circle array contain all Circle objects
let circles = [];
//The virtual Pixel array. Contains all Pixel objects
let pxlArray;
//The BorderPixel array contains all BorderPixel objects
let borderPxl = [];

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
            pxlArray[x][y] = new Pixel(PXL_STATE_EMPTY, DEFAULT_PXL_COLOR);
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
    background("#1e1e1e");

    //set the current circle radius to 0 
    currentRadius = 2;

    //If the page is loaded the first time, amountCircles is undefined. On first load, the circles must be generated. Later, they can just be drawn again
    if (!amountCircles) {
        //default value amount Circles
        amountCircles = 10;
        //generate circles
        state = GENERATE_CIRCLES;
    } else {
        //draw circles points
        state = DRAW_CIRCLES;
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
        background("#1e1e1e");
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
    for (let i = 0; i < circles.length; i++) {
        //function of p5js. Draws a small ellipse
        ellipse(circles[i].getCenterX(), circles[i].getCenterY(), 3, 3);
    }
    //function of p5js. Retrieve the old canvas options (set above)
    pop();
}

//Generate new circle objects with random center points
function generateCirclesFun() {
    circles = [];
    for (let i = 0; i < amountCircles; i++) {
        //Random center points and set default pixel color
        //make sure that no circle center is on top of each other
        let randX;
        let randY;
        let tendency = Math.sqrt((constHeight * constWidth) / ((amountCircles) * Math.PI))*0.6;
        do {
            randX = Math.floor(Math.random() * constWidth);
            randY = Math.floor(Math.random() * constHeight);
            for (let j = 0; j < circles.length; j++) {
                let distance = Math.sqrt(Math.pow((circles[j].getCenterX() - randX),2) + Math.pow((circles[j].getCenterY() - randY), 2));
                if (distance < tendency) {
                    randX = false;
                    randY = false;
                    break;
                }
            }
        } while (!randX && !randY);

        let circle = new Circle(
            randX,
            randY,
            0,
            DEFAULT_PXL_COLOR
        );
        circles.push(circle);
    }
    //Draw the circles on the canvas that were just generated
    state = DRAW_CIRCLES;
}

//This algorithm tries to solve the issue using circles that get bigger and bigger. At some point the will
//overlap each other. These intersection points are the border of the voronoi field.
//For more information, consider reading the documentation.
function circleModeFun() {
    background("#1e1e1e");
    //function of p5js. It loads all displaying pixel from the canvas.
    loadPixels();
    //Internal flag if algorithm is finished
    //set temporarily to true. (Must be false if even one of the circles isn't)
    let finished = true;

    for (let i = 0; i < circles.length; i++) {
        if (!circles[i].getSurrounded()) {
            //Internal flag if all pixels can't be set
            //set temporarily to true. (Must be false if even one of the pixel can be set)
            circles[i].setSurrounded(true);
            //draw the circle in the virtual pixel array AND in the canvas
            DrawCircleInArrayAndCanvas(
                circles[i].getCenterX(),
                circles[i].getCenterY(),
                currentRadius,
                circles[i].getColor(),
                circles[i]
            );
        }
        //detect if all circles are surrounded
        if (finished) {
            finished = circles[i].getSurrounded();
        }
    }
    //check if it's finished
    if (finished) {
        for (let i = 0; i < circles.length; i++) {
            circles[i].setSurrounded(false);
        }
        finish();
    }
    //draw the border pixels
    drawBorderPixel();

    //function of p5js. It updates all displaying pixel on the canvas.
    updatePixels();
    //draw the center points of the circles again
    drawPoints();

    //make the radius bigger
    currentRadius += 1;
}

//this function is called when a algorithm has finished
let finish = function () {
    //set finished flag to true
    finishedAlgo = true;
    //we tell the program to do nothing after it finished
    state = DO_NOTHING;
};

//This function draws the circle with pixels
//It draws the circle in to the virtual pixel array and the real one. (real is only for displaying)
let DrawCircleInArrayAndCanvas = function (x0, y0, radius, color, circle) {
    let x = radius;
    let y = 0;
    let radiusError = 1 - x;

    //draw whole circle
    //todo link to source
    while (x >= y) {
        //The circle has a boarder of 2 pixels to insure that every pixel has been set at least once.
        //( x | y )
        setPixelInArrayAndCanvas(x + x0, y + y0, radius, color, circle);
        setPixelInArrayAndCanvas(x + x0 + 1, y + y0, radius, color, circle);

        //( x | -y )
        setPixelInArrayAndCanvas(x + x0, -y + y0, radius, color, circle);
        setPixelInArrayAndCanvas(x + x0 + 1, -y + y0, radius, color, circle);

        //( -x | y )
        setPixelInArrayAndCanvas(-x + x0, y + y0, radius, color, circle);
        setPixelInArrayAndCanvas(-x + x0 - 1, y + y0, radius, color, circle);

        //( -x | -y )
        setPixelInArrayAndCanvas(-x + x0, -y + y0, radius, color, circle);
        setPixelInArrayAndCanvas(-x + x0 - 1, -y + y0, radius, color, circle);

        //( y | x )
        setPixelInArrayAndCanvas(y + x0, x + y0, radius, color, circle);
        setPixelInArrayAndCanvas(y + x0 + 1, x + y0, radius, color, circle);

        //( y |- x )
        setPixelInArrayAndCanvas(y + x0, -x + y0, radius, color, circle);
        setPixelInArrayAndCanvas(y + x0 + 1, -x + y0, radius, color, circle);

        //( -y | x )
        setPixelInArrayAndCanvas(-y + x0, x + y0, radius, color, circle);
        setPixelInArrayAndCanvas(-y + x0 - 1, x + y0, radius, color, circle);

        //( -y | -x )
        setPixelInArrayAndCanvas(-y + x0, -x + y0, radius, color, circle);
        setPixelInArrayAndCanvas(-y + x0 - 1, -x + y0, radius, color, circle);

        y++;

        if (radiusError < 0) {
            radiusError += 2 * y + 1;
        } else {
            x--;
            radiusError += 2 * (y - x + 1);
        }
    }
};

//this function sets an individual pixel in the virtual pixel array and the real one
let setPixelInArrayAndCanvas = function (x, y, pixelState, color, circle) {
    //check if inside the canvas
    if (x >= 0 && x < constWidth && y >= 0 && y < constHeight) {
        let pxl = pxlArray[x][y];

        //check if the pixel has the same size
        //circles with the same size will recognize each other by having the same state with each pixel (see documentation)
        //pixels that have the state will be added as boarder pixel
        if ((pxl.getState() == pixelState || pxl.getState() == (pixelState - 1)) && pxl.getCircle() !== circle) {
            //set Pixel to boarder state
            pxl.setState(PXL_STATE_BORDER);
            pxl.setColor(BORDER_PXL_COLOR);
            //which circle it belongs to
            pxl.setCircle(circle);

            //add a new pixel to the boarder pixel. This allows us to only paint the boarder pixels and not the whole array
            borderPxl.push(new BorderPixel(x, y, PXL_STATE_BORDER, BORDER_PXL_COLOR));

            //if pixel can be set it's not surrounded => circle is not surrounded
            if (pxl.getCircle().getSurrounded()) {
                pxl.getCircle().setSurrounded(false);
            }

            //if pixel has no state yet, it should belong to the this circle
        } else if (pxl.getState() == PXL_STATE_EMPTY) {
            //detect if Pixel empty
            pxl.setState(pixelState);
            pxl.setColor(color);
            pxl.setCircle(circle);

            //Here are also the active pixels displayed. The circle which gets bigger and bigger will be set here.
            //why here?  Because like the pixels only have to be painted if they haven hit another circle
            let index = (x + y * constWidth) * 4;
            pixels[index] = PIXEL_ACTIVE_COLOR_RGB.r;
            pixels[index + 1] = PIXEL_ACTIVE_COLOR_RGB.g;
            pixels[index + 2] = PIXEL_ACTIVE_COLOR_RGB.b;
            pixels[index + 3] = 255;

            //if pixel can be set because it's not surrounded
            if (pxl.getCircle().getSurrounded) {
                pxl.getCircle().setSurrounded(false);
            }
        }
    }
};

//this function draws only the border pixels. Because we only have to draw the boarder pixels, we achieve a big performance boost
let drawBorderPixel = function () {
    //iterate through the border pixel array
    for (let i = 0; i < borderPxl.length; i++) {
        let tmpBorderPxl = borderPxl[i];
        //let borderPxlColor = hexToRgb(tmpBorderPxl.getColor());
        let borderPxlColor = BORDER_PXL_COLOR_RGB;

        //set pixel in the canvas
        let index = (tmpBorderPxl.getX() + tmpBorderPxl.getY() * constWidth) * 4;
        pixels[index] = borderPxlColor.r;
        pixels[index + 1] = borderPxlColor.g;
        pixels[index + 2] = borderPxlColor.b;
        pixels[index + 3] = 255;
    }
};

//this function allows us to create multidimensional arrays in javascript. In native javascript this not possible like in java.
function createPxlArray(length) {
    let arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        let args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createPxlArray.apply(this, args);
    }
    return arr;
}

//this function converts a hex color code to a rgb json object
function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : null;
}