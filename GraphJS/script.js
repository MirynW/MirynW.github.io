/*
JSGraph
Michael Nickerson
3/4/2020

goal: 
    create a dynamically growing and shrinking graph that can compute and graph recursive functions
    the domain of the function should be capable of changing or we could represent transformations
    between the domain of the graph by creating a new graph with new properties*****

feature list:
    - Class that defines a graph, its given range, two arrays that contain the domain and range values 
    for the given function.
    - User interface that allows for user defined functions using expression trees
        -> Expression trees will have either single variable members which can be plot over the discrete domain
        -> or they will have a mapping where the value of one variable is itself another function
        -> this ability to set variables to themselves will allow for recursive behavior and thus
        -> we will have user defined lambda expressions.
        =====> The user interface should allow for the user to create new graphs, alter the domain and range of graphs,
                apply transformation functions to the given signal/currently defined function, and possibly implement
                a database for storing and retrieving graphs that the user has created => user login required (maybe).
    - Complex graphs, 3d graphs, 4d graphs and so on can be considered however not needed at the start,
        however complex graphs will be required to create a standard way of representing the fourier transform of a function

    - Functions that will run over time should be given the option to "pan" with time. This will allow the user to follow
        the function over time => simulating system impulses would also be an interesting idea using convolution between
        two functions. This would mean we are implementing the fft and invfft.
*/


class Graph {
    constructor(idomain, irange, iorigin, ioffset, idomObjectRef) {
        this.domain = idomain;  // Range object
        this.range = irange;    // Range object
        this.origin = iorigin;  // Vector2d object
        this.offset = ioffset   // numberical value
        this.canvasReference = idomObjectRef;   // DOM object
        this.canvasContext = this.canvasReference.getContext('2d');
        this.time = -10;
        this.plotArray = new Array(20);     // Graph can contain several plots
        this.plotArray.push(new Plot("#000000", "none", 0));       // Start off with a default graph
        /*this.canvasReference.addEventListener('mousedown',handleMouseClick)
			canvas.addEventListener('mousemove',
				function(evt) {
					currentMousePosition = calculateMousePos(evt);
					
                });*/       // Define the calculateMousePos(evt) function';p
    }

    addDataPoint(dVector, plotID) {
        if(dVector.x > this.domain.max || dVector.x < this.domain.min) {
            let oldDomain = new Range(this.domain.min, this.domain.max);
            this.domain.rangeAdapt(dVector.x);
            //this.mapNormalize(oldDomain, this.domain, "x");
        }
        if(dVector.y > this.range.max || dVector.y < this.range.min) {
            let oldRange = new Range(this.range.min, this.range.max);
            this.range.rangeAdapt(dVector.y);
            //this.mapNormalize(oldRange, this.range, "y");
        }
        
        let p = this.getPlot(0);
        p.plot(dVector);
        this.mapRender();
    }

    check() {
        // Use for timed function ---- Test a timed function to check the range adapt feature
        this.time += 0.1;
        this.addDataPoint(new Vector2d(this.time, Math.sin(2*3.1419*this.time)));
    }

    update() {
        // Use for timed functions
        //this.mapRender();
    }
    // Linear search for now -> Change later to use binary search or just direct mapping
    getPlot(id) {
        let G;
        this.plotArray.forEach(Plot => {
            if(Plot.id == id)
                G = Plot;
        });
        return G;
    }


/* 
Map Normalize:
    when points are given that are out of range, map all new points 
*/
    mapNormalize(oldRange, usedRange, dir) {
        oldRange.positiveShift();       // Shift both ranges int a 0,n format
        usedRange.positiveShift();
        this.plotArray.forEach(Plot => {
            Plot.remap(oldRange, usedRange, dir);
        });
        usedRange.shiftBack();      // Shift range back to the original format
    }

// Map_reduce

// Map_gain

// Map_transform

/* 
mapRender:
    Use the given range of the canvas to remap the points to the correct range
    plot the points on this range
*/
    mapRender() {
        /*
        We have a list of points dedicated to a specific range -> Now we need to compress the points in this range
        to be in the bounds of the graph:
         - Probably want to normalize the graph
        */
        let width = this.canvasContext.canvas.width;
        let height = this.canvasContext.canvas.height
        let cWidthDomain = new Range(0, width);
        let cHeightDomain = new Range(0, height);
        cWidthDomain.min -= width/2;
        cWidthDomain.max -= width/2;
        cHeightDomain.min -= height/2;
        cHeightDomain.max -= height/2;

        // remap all points to new domain => go through points
        // remove duplicates
        // Never mind just move the points themselves ("translate() doesnt work")


        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, height/2);
        this.canvasContext.lineTo(width, height/2);
        this.canvasContext.lineWidth = 1;
        this.canvasContext.strokeStyle = rgbToHex(0,0,0);
        this.canvasContext.stroke();

        this.canvasContext.beginPath();
        this.canvasContext.moveTo(width/2, 0);
        this.canvasContext.lineTo(width/2, height );
        this.canvasContext.lineWidth = 1;
        this.canvasContext.strokeStyle = rgbToHex(0,0,0);
        this.canvasContext.stroke();

        this.plotArray.forEach(Plot => {
            Plot.remap(this.domain, cWidthDomain, "x");
            Plot.remap(this.range, cHeightDomain, "y");
            Plot.draw(this.canvasContext);
        });



    }


}

class Vector2d {
    constructor(ix, iy) {
        this.x = ix;
        this.y = iy;
    }

    // Methods
    getMagnitude() {
        return Math.sqrt(this.x*this.x + this.y * this.y);
    }

    // Vector (*) Vector operations
    distance(dVector) {     // Expected change of vector
        return Math.sqrt( Math.pow(this.x-dVector.x, 2) + Math.pow(this.y-dVector.y, 2) );
    }
    summation(dVector) {
        this.x += dVector.x;
        this.y += dVector.y;
    }
    subtraction(dVector) {
        this.x -= dVector.x;
        this.y -= dVector.y;
    }
    multiplication(dVector) {
        this.x *= dVector.x;
        this.y *= dVector.y;
    }
    divide(dVector) {
        this.x /= dVector.x;
        this.y /= dVector.y;
    }
    limit(dVector) {
        let signX = ((this.x > 0)? 1 : -1);
        let signY = ((this.y > 0)? 1 : -1);


        if(this.x * signX > dVector.x)
            this.x = dVector.x * signX;
        if(this.y * signY > dVector.y)
            this.y = dVector.y * signY;
    }
    setMagnitude(newMagnitude) {
        let currentMagnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x = this.x * newMagnitude / currentMagnitude;
        this.y = this.y * newMagnitude / currentMagnitude;
    }
    dotProduct(dVector) {
        return this.x * dVector.x + this.y * dVector
    }
    // Polar Functions
    getAngle(origin) {
        return Math.atan((this.y - origin.y)/(this.x - origin.x)) * (180/Math.PI);
    }

    // Vector (*) Scalar operations
    scalarAdd(scalar) {
        this.x += scalar;
        this.y += scalar;
    }
    scalarSubtract(scalar) {
        this.x -= scalar;
        this.y -= scalar;
    }
    scalarMultiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    scalarDivide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }
    scalarLimit(scalar) {
        let signX = ((this.x > 0)? 1 : -1);
        let signY = ((this.y > 0)? 1 : -1);


        if(this.x * signX > scalar)
            this.x = scalar * signX;
        if(this.y * signY > scalar)
            this.y = scalar * signY;
    }
    shiftToOrigin(dVector) {
        this.x += dVector.x;
        this.y += dVector.y;
    }
    shiftBack(dVector) {
        this.x -= dVector.x;
        this.y -= dVector.y;
    }

    // Vector (*) Matrix operations
    // Do later*********************************************************
}

class Range {
    constructor(inMin, inMax, offset) {
        this.min = inMin;
        this.max = inMax;
        this.offset = offset;
        if(inMin < 0)
            this.shiftValue = -1*inMin;
        else
            this.shiftValue = 0;
    }
    isInRange(value) {
        if(value > this.max || value < this.min)
            return false;
        return true;
    }
    rangeAdapt(value) {
        if(value > this.max)
            this.max = value + this.offeset;
        else
            this.min = value - this.offset;
        // Set the shift value
        if(this.inMin < 0)
            this.shiftValue = -1*this.inMin;
        else
            this.shiftValue = 0;
    }
    
    /* 
    normalize:
        centers the range at 0.
    */
    normalize() {
        let aMin = abs(this.min);
        let aMax = abs(this.max);
        let max = (aMin > aMax) ? aMin : aMax;
        this.min = -1*max;
        this.max = max;
        // Set the shift value
        this.shiftValue = max;
    }

    // Use for mapping points to this domain. Mapping function only works on a range [0,n].
    positiveShift() {
        this.min += this.shiftValue;
        this.max += this.shiftValue;
    }
    shiftBack() {
        this.min -= this.shiftValue;
        this.max -= this.shiftValue;
    }
}

// for now, just leave the interpolation method as linear or none "Map key to method later"
class Plot {
    constructor(icolor, iMethod, id) {
        this.color = icolor
        this.interpolationMethod = iMethod;
        this.id = id;
        this.plotArray = new Array(20); // contains vector2d objects unshifted
        this.RenderablePlot = new Array(20);    // Contains the Vector2d objects mapped for the canvas - Fixes issue with precision loss
    }
    plot(dVector) {
        this.plotArray.push(dVector);
    }
    draw(canvasContext) {
        let width = canvasContext.canvas.width;
        let height = canvasContext.canvas.height;
        let origin = new Vector2d(width/2, height/2);
        let nX = 0;
        let nY = 0;
        this.plotArray.forEach(element => {
            
            let nVec = new Vector2d(element.x, element.y);
            this.RenderablePlot.push(nVec);
        });
        this.RenderablePlot.forEach(element => {
            canvasContext.fillstyle = this.color;
            element.y *= -1;
            element.shiftToOrigin(origin);
            canvasContext.fillRect(element.x, element.y, 2, 2);
            element.shiftBack(origin);
        });

        for(let i=0; i<this.RenderablePlot.length; i++)
            this.RenderablePlot.pop();
    }
    // Gross code fix later***************************************
    remap(oldDomain, newDomain, dir) {
        oldDomain.positiveShift();
        newDomain.positiveShift();
        let val = 0;
        if(dir == "x") {
            this.RenderablePlot.forEach(Vector2d => {
                val = Vector2d.x += oldDomain.shiftValue;
                Vector2d.x = map2Range(val, oldDomain.min, oldDomain.max, newDomain.min, newDomain.max) - oldDomain.shiftValue;
            });
        }
        else if(dir == "y") {
            this.RenderablePlot.forEach(Vector2d => {
                val = Vector2d.y += oldDomain.shiftValue;
                Vector2d.y = map2Range(val, oldDomain.min, oldDomain.max, newDomain.min, newDomain.max) - oldDomain.shiftValue;
            });
        }
        oldDomain.shiftBack();
        newDomain.shiftBack();
    }

}


/* 
    Initialize Everything here:
        Essentially the main function
*/
window.onload = function() {
	canvas = document.getElementById('canvas_graph');
    canvasContext = canvas.getContext('2d');

    /* We will have a singular graph by defualt but may add newer graphs later on */
    /* Look into DOM maninpulation and creating child nodes under a master graph class defined in hmtl */
    /* We will have to keep track of a list of graphs or have the DOM keep track of it for us -> rendering, deleting, creating, altering */
    /* User Interface created for each consecutive graph -> User Interface A => Graph A, UI B => G B and so on -> Keep reference to ui and graph using a map*/
    
    let d1 = new Range(-10, 10);
    let d2 = new Range(-10, 10);
    let v = new Vector2d(canvas.width/2,canvas.height/2);


    let g = new Graph(d1, d2, v,10, canvas);
    g.mapRender();      // Map render is a weird name for rendering a graph ****Change to graphRender or just render()


	setInterval(function(){g.check(); g.update(); test(g);}, 10);
}

/*
I spent 5 minutes making this massive box, you better not miss it while reading through the code
*************************************************************************
*   *******    *        ****    ******         *       *                *
*   *          *       *    *   **    *       * *      *                *
*   *    ***   *       *    *   ******       *   *     *                *
*   *     *    *       *    *   **    *     *******    *                *
*   *******    ******   ****    *******    *       *   *******          *
*************************************************************************
*/

var graphList;      // Will hold reference to the canvas objects that are created in the DOM
var DBAPIKEY;       // Will hold the database api key
var functionList;   // Will hold our user defined functions
var value = 0;


function test(g) {

}



/* Helper functions */

/* 
        Map2Range:
    takes the displacement between the input minimum and the value given scale by the new range,
    normalize by the old range, ensure the value is within the output range minimum by adding outRangeMin
*/
function map2Range(value, inRangeMin, inRangeMax, outRangeMin, outRangeMax) {
    let rangeOld = inRangeMax - inRangeMin;
    let rangeNew = outRangeMax - outRangeMin;
    return (((value - inRangeMin) * rangeNew) / rangeOld) + outRangeMin;        
}

// Made by random person on stack overflow (thank)
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// General clamp function
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}