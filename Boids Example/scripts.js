// Define classes
class Vector2d {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
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
    // Polar Functions
    getMagnitude() {
        return Math.sqrt(this.x*this.x + this.y * this.y);
    }
    getAngle(origin) {
        return Math.atan((this.y - origin.y)/(this.x - origin.x)) * (180/Math.PI);
    }
}

class Boid {
    constructor(color, position, velocity, acceleration, visionRadius, maxForce, index) {
        this.color = color;         // HTML Color
        this.position = position;   // Vector2d
        this.velocity = velocity;         // floating point
        this.acceleration = acceleration;   // Vector2d
        this.visionRadius = visionRadius;
        this.turnRadius = turnRadius_Global;
        this.maxForce = 1;
        this.maxSpeed = 4;
        this.lastVisitedTarget = null;
        this.index = index;
    }

    /*
    // Alignment
    alignment() {
        let average = new Vector2d(0,0);
        let numNeighbors = 0;
        boidArray.forEach(Boid => {
            if(this.position.distance(Boid.position) < this.visionRadius)
                if(Boid != this && this.isInView(Boid.position)) {
                    average.summation(Boid.velocity);
                    numNeighbors++;
                }
        });
        // take average
        if(numNeighbors > 0) {
            average.divide(new Vector2d(numNeighbors, numNeighbors));
            average.setMagnitude(this.maxSpeed);
            // Steering formula
            average.subtraction(this.velocity);
            average.limit(new Vector2d(this.maxForce, this.maxForce));
        }
            
        return average;
    }

    // Cohesion
    cohesion() {
        let average = new Vector2d(0,0);
        let numNeighbors = 0;
        boidArray.forEach(Boid => {
            if(this.position.distance(Boid.position) < this.visionRadius)
                if(Boid != this && this.isInView(Boid.position)) {
                    average.summation(Boid.position);
                    numNeighbors++;
                }
        });
        // take average
        if(numNeighbors > 0) {
            average.divide(new Vector2d(numNeighbors, numNeighbors));
            // Steering formula
            // desired_velocity - current_velocity
            average.subtraction(this.position);
            average.setMagnitude(this.maxSpeed);
            average.subtraction(this.velocity);
            average.limit(new Vector2d(this.maxForce, this.maxForce));
        }
            
    
        return average;
    }

    // Separation
    separation() {
        let average = new Vector2d(0,0);
        let numNeighbors = 0;
        boidArray.forEach(Boid => {
            if(this.position.distance(Boid.position) < this.visionRadius)
                if(Boid != this && this.isInView(Boid.position)) {
                    let dist = this.position.distance(Boid.position);
                    let difference = new Vector2d(1,1);
                    difference.multiplication(this.position);
                    difference.subtraction(Boid.position);
                    // magnitude is inversely proportional to the distance between boids
                    difference.divide(new Vector2d(dist*dist,dist*dist));
                    average.summation(difference);
                    numNeighbors++;
                }
        });
        // take average
        if(numNeighbors > 0) {
            average.divide(new Vector2d(numNeighbors, numNeighbors));
            // Steering formula
            // desired_velocity - current_velocity
            average.setMagnitude(this.maxSpeed);
            average.subtraction(this.velocity);
            average.limit(new Vector2d(this.maxForce, this.maxForce));
        }
            
    
        return average;
    }*/

    obstacleAvoidance() {
        let average = new Vector2d(0,0);
        let numNeighbors = 0;
        obstacleArray.forEach(Square => {
            let angle = this.position.getAngle(Square.position);
            let squarePoint = Square.rayCollision(angle);
            

            if(this.position.distance(squarePoint) < this.visionRadius)
                if(Boid != this && this.isInView(squarePoint)) {
                    let dist = this.position.distance(squarePoint);
                    let difference = new Vector2d(1,1);
                    difference.multiplication(this.position);
                    difference.subtraction(squarePoint);
                    // magnitude is inversely proportional to the distance between boids
                    difference.divide(new Vector2d(dist*dist,dist*dist));
                    average.summation(difference);
                    numNeighbors++;
                }
        });
        // take average
        if(numNeighbors > 0) {
            average.divide(new Vector2d(numNeighbors, numNeighbors));
            // Steering formula
            /*desired_velocity - current_velocity*/ 
            average.setMagnitude(this.maxSpeed);
            average.subtraction(this.velocity);
            average.limit(new Vector2d(this.maxForce, this.maxForce));
        }
            
    
        return average;
    }

    target() {
        let average = new Vector2d(0,0);
        let numNeighbors = 0;
        targetArray.forEach(Sphere => {
            if(this.position.distance(Sphere.position) < this.visionRadius)
                if(this.isInView(Sphere.position) && Sphere != this.lastVisitedTarget) {
                    average.summation(Sphere.position);
                    numNeighbors++;
                    // Don't use the most recently visited sphere
                    if(this.position.distance(Sphere.position) <= Sphere.radius) {
                        this.lastVisitedTarget = Sphere;
                    }
                }
        });
        // take average
        if(numNeighbors > 0) {
            average.divide(new Vector2d(numNeighbors, numNeighbors));
            // Steering formula
            /*desired_velocity - current_velocity*/ 
            average.subtraction(this.position);
            average.setMagnitude(this.maxSpeed);
            average.subtraction(this.velocity);
            average.limit(new Vector2d(this.maxForce, this.maxForce));
        }
            
    
        return average;
    }

    combinedBoidAlgorithm() {
        let averageSeparation = new Vector2d(0,0);
        let numNeighborsSeparation = 0;
        let averageCohesion = new Vector2d(0,0);
        let numNeighborsCohesion = 0;
        let averageAlignment = new Vector2d(0,0);
        let numNeighborsAlignment = 0;
        boidArray.forEach(Boid => {
            if(this.position.distance(Boid.position) < this.visionRadius)
                if(Boid != this && this.isInView(Boid.position)) {
                    // Separation
                    let dist = this.position.distance(Boid.position);
                    let difference = new Vector2d(1,1);
                    difference.multiplication(this.position);
                    difference.subtraction(Boid.position);
                    // magnitude is inversely proportional to the distance between boids
                    difference.divide(new Vector2d(dist*dist,dist*dist));
                    averageSeparation.summation(difference);
                    numNeighborsSeparation++;
                    // Cohesion
                    averageCohesion.summation(Boid.position);
                    numNeighborsCohesion++;
                    // Alignment
                    averageAlignment.summation(Boid.velocity);
                    numNeighborsAlignment++;
                }
        });
        // take average
        if(numNeighborsSeparation > 0) {
            averageSeparation.divide(new Vector2d(numNeighborsSeparation, numNeighborsSeparation));
            // Steering formula
            /*desired_velocity - current_velocity*/ 
            averageSeparation.setMagnitude(this.maxSpeed);
            averageSeparation.subtraction(this.velocity);
            averageSeparation.limit(new Vector2d(this.maxForce, this.maxForce));
        }

        // take average
        if(numNeighborsCohesion > 0) {
            averageCohesion.divide(new Vector2d(numNeighborsCohesion, numNeighborsCohesion));
            // Steering formula
            /*desired_velocity - current_velocity*/ 
            averageCohesion.subtraction(this.position);
            averageCohesion.setMagnitude(this.maxSpeed);
            averageCohesion.subtraction(this.velocity);
            averageCohesion.limit(new Vector2d(this.maxForce, this.maxForce));
        }
        // take average
        if(numNeighborsAlignment > 0) {
            averageAlignment.divide(new Vector2d(numNeighborsAlignment, numNeighborsAlignment));
            averageAlignment.setMagnitude(this.maxSpeed);
            // Steering formula
            /*desired_velocity - current_velocity*/ 
            averageAlignment.subtraction(this.velocity);
            averageAlignment.limit(new Vector2d(this.maxForce, this.maxForce));
        }
        averageAlignment.summation(averageCohesion);
        averageSeparation.summation(averageAlignment);
        return averageSeparation;
    }

    isInView(other) {
        let theta1 = this.position.getAngle(this.velocity);
        let theta2 = this.position.getAngle(other);
        if(theta2 < theta1 + this.turnRadius && theta2 > theta1 - this.turnRadius)
            return true;
        return false;
    }



    // Can change later but in general draws a boid to the canvas
    drawBoid() {
        canvasContext.fillStyle = this.color;
        canvasContext.strokeStyle = this.color;
		canvasContext.beginPath();
		canvasContext.arc(this.position.x, this.position.y, 4, 0, Math.PI*2, true);
        canvasContext.fill();
        canvasContext.beginPath();
        canvasContext.moveTo(this.position.x, this.position.y);
        canvasContext.lineTo(this.position.x + this.velocity.x*5, this.position.y + this.velocity.y*5);
        canvasContext.stroke();
    }

    flockingAlgorithm() {
        /*
        let steeringAlignment = this.alignment();
        let steeringCohesion = this.cohesion();
        let steeringSeparation = this.separation();
        */
        let steeringACS = this.combinedBoidAlgorithm();
        let obAvoid = this.obstacleAvoidance();
        let targetVelocity = this.target();
        /*
        this.acceleration.summation(steeringAlignment);
        this.acceleration.summation(steeringCohesion);
        this.acceleration.summation(steeringSeparation);
        */
       this.acceleration.summation(steeringACS);
        this.acceleration.summation(obAvoid);
        this.acceleration.summation(targetVelocity);
    }

    boidUpdate() {
        this.flockingAlgorithm();       // There goes my alignment boys
        this.position.summation(this.velocity); // update position based on velocity
        this.velocity.summation(this.acceleration); // update velocity based on acceleration
        this.velocity.limit(new Vector2d(this.maxSpeed, this.maxSpeed));
        this.acceleration.multiplication(new Vector2d(0,0));
        if(this.position.x < 0)
            this.position.x = canvas.width-10;
        if(this.position.y < 0)
            this.position.y = canvas.height-10;
        if(this.position.x > canvas.width)
            this.position.x = 5;
        if(this.position.y > canvas.height)
            this.position.y = 5;
    }

}

class Sphere {
    constructor(position, radius, color) {
        this.position = position;
        this.radius = radius;
        this.color = color;
    }
    

    // Spherical collision is fairly straightforward
    rayCollision(angle) {
        angle *= (Math.PI/180);
        let col = new Vector2d(this.radius * Math.cos(angle) + this.position.x, this.radius * Math.cos(angle) + this.position.y);
        return col;
    }


    drawSphere() {
        canvasContext.fillStyle = this.color;
		canvasContext.beginPath();
		canvasContext.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, true);
        canvasContext.fill();
    }

}

class Square {
    constructor(position, radius, color) {
        this.position = position;
        this.radius = radius;
        this.color = color;
    }
    

    // Spherical collision is fairly straightforward
    rayCollision(angle) {
        //angle *= (Math.PI/180);
        // Figure out where the ray at the given angle is colliding with the wall of the cube
        // Determine what point the angle is relative to
        /* concept
            angle relative to square.position:      // Seems really unnecessary solving 1of4 linear equations per side
                -45 <= angle <= 45:     // x1 * what_magnitude = x2?
                    magnitude = x1/p.x
                135 < angle < 225:
                    magnitude = x2/p.x
                45 < angle < 135: 
                    magnitude = y1/p.y
                225 < angle < 315: 
                    magnitude = y2/p.y
        */
       /*let magnitude;
       let cubicPoint;
        if(315 > angle || (angle >= 0 && angle < 45)) {
            magnitude = (this.position.x + 2*this.radius)/Math.cos(angle);
        }
        else if(checkBounds(45, angle, 135)) {
            magnitude = (this.position.y)/Math.sin(angle);
        }
        else if(checkBounds(135, angle, 225)) {
            magnitude = (this.position.x)/Math.cos(angle);
        }
        else if(checkBounds(225, angle, 315)) {
            magnitude = (this.position.y + 2*this.radius)/Math.sin(angle);
        }
        else
            magnitude = 1;
        cubicPoint = new Vector2d(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
        return cubicPoint;*/

        angle *= (Math.PI/180);
        let col = new Vector2d(this.radius * Math.cos(angle) + this.position.x, this.radius * Math.cos(angle) + this.position.y);
        return col;

    }


    drawSquare() {
        canvasContext.fillStyle = this.color;
        canvasContext.fillRect(this.position.x, this.position.y, this.radius*2, this.radius*2, this.color);
    }

}

class Edge {
    constructor(v1,v2) {
        this.v1 = v1;
        this.v2 = v2;
    }

    drawLine() {
        canvasContext.beginPath();
        canvasContext.moveTo(this.v1.x, this.v1.y);
        canvasContext.lineTo(this.v2.x, this.v2.y);
        canvasContext.lineWidth = 1;
        canvasContext.strokeStyle = distanceToColor(this);
        canvasContext.stroke();
    }

}

// Keep track of edges


window.onload = function() {
	canvas = document.getElementById('canvas_boids');
    canvasContext = canvas.getContext('2d');
    //loadExtras();
    for(i=0; i<numberBoids; i++) {
        loadInformation(i);
        if (!adjacencyMatrix[i]) adjacencyMatrix[i] = [];
    }
    this.boxSize = 75;
    for(i=0; i<this.canvas.width-boxSize; i+=gapSize + this.obstacleRadius + boxSize) {
        for(j=0; j<this.canvas.height-boxSize; j+=gapSize + this.obstacleRadius + boxSize) {
            if(this.Math.random() > 0.3) {
                XBound = new Vector2d(i, i+this.boxSize);
                YBound = new Vector2d(j, j+this.boxSize);
                let position = createRandomVector2d(XBound.x, YBound.x, XBound.y, YBound.y);
                let obstacle = new Square(position, 20, rgbToHex(100,100,200));
                this.obstacleArray.push(obstacle);
            }
            else {
                XBound = new Vector2d(0, canvas.width);
                YBound = new Vector2d(0, canvas.height);
                let position = createRandomVector2d(XBound.x, YBound.x, XBound.y, YBound.y);
                target = new Sphere(position, 10, rgbToHex(200,50,50));
                this.targetArray.push(target);
            }
        }
    }
    canvas.addEventListener('mousedown',handleMouseClick)
			canvas.addEventListener('mousemove',
				function(evt) {
					currentMousePosition = calculateMousePos(evt);
					
				});
	setInterval(function(){check(); update();}, 1000/Fps);
}

// Global Variables

var Fps = 60;      // Control how often we call check(), update(), and paint()
var accelerationCap = 1;
var velocityCap = 1;
var canvas;
var canvasContext;
// Boundary Information
var LBound;
var RBound;
// Array that contains our flock
var boidArray = [];
var obstacleArray = [];
var targetArray = [];
var edgeArray = [];
var selectedObstacle = false;
var selectedTarget = false;
var currentMousePosition = 0;
var showConnections = false;
var adjacencyMatrix = [[],[]];
var numberBoids = 200;
var visionRadius = 50;
var turnRadius_Global = 90;

// Poisson Disk Distribution Grid
var poissonDiskDistGrid = [[],[]];
var boxSize = 0;
var gapSize = 30;   // 10px
var targetRadius = 10;  // define radius sizes
var obstacleRadius = 20;



function selectObstacle() {
    selectedObstacle = true;
    selectedTarget = false;
}

function selectTarget() {
    selectedObstacle = false;
    selectedTarget = true;
}

function selectConnections() {
    if(showConnections)
        showConnections = false;
    else
        showConnections = true;
}

function changeVisionRadius() {
    value = document.getElementById('cvr_input').value;
    if(value == null)
        return;
    value = clamp(value, 0, canvas.width * canvas.height);
    setTimeout(check, update, 1000);
    boidArray.forEach(Boid => {
        Boid.visionRadius = value;
    });
    visionRadius = value;
}

function changeTurnRadius() {
    value = document.getElementById('ctr_input').value;
    if(value == null)
        return;
    if(value < 0)
        value = 360+value;
    value %= 360;
    value = clamp(value, 0, 360);
    setTimeout(check, update, 1000);
    boidArray.forEach(Boid => {
        Boid.turnRadius = value;
    });
    turnRadius_Global = value;
}

function spawnBoids() {
    value = document.getElementById('swn_input').value;
    if(value == null)
        return;
    if(value < 0) {
        setTimeout(check, update, 1000);
        for(i=0; i<value*-1 && boidArray.length > 0; i++) {
            boidArray.pop();
            numberBoids--;
        }  
    }
    else {
        setTimeout(check, update, 1000);
        for(i=0; i<value; i++) {
            loadInformation(i+numberBoids);
            if (!adjacencyMatrix[i + numberBoids]) adjacencyMatrix[i + numberBoids] = [];
        }  
        numberBoids += value;
    }
}


function handleMouseClick() {
    if(selectedTarget) {
        targetArray.push(new Sphere(currentMousePosition, targetRadius, rgbToHex(200,50,50)));
    } else {
        obstacleArray.push(new Square(currentMousePosition, obstacleRadius, rgbToHex(100,100,200)));
    }
}

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
        };
}

function generateObstacle(color) {
    XBound = new Vector2d(0, canvas.width);
    YBound = new Vector2d(0, canvas.height);
    let position = createRandomVector2d(XBound.x + 10, YBound.x + 10, XBound.y - 10, YBound.y - 10);
    obstacle = new Square(position, 20, color);
    return obstacle;
}

function generateTarget(color) {
    XBound = new Vector2d(0, canvas.width);
    YBound = new Vector2d(0, canvas.height);
    let position = createRandomVector2d(XBound.x + 10, YBound.x + 10, XBound.y - 10, YBound.y - 10);
    obstacle = new Sphere(position, 10, color);
    return obstacle;
}

function loadExtras() {
    obstacleArray.push(generateObstacle("#808080"));
    targetArray.push(generateTarget("Red"));
}

function loadInformation(index) {
    LBound = new Vector2d(0, canvas.width);
    RBound = new Vector2d(0, canvas.height);
    let position = createRandomVector2d(LBound.x, RBound.x, LBound.y, RBound.y);
    let velocity = createRandomVector2d(-1,-1,1,1);
    let acceleration = createRandomVector2d(-1,-1,1,1);
    let scalar_v = new Vector2d(Fps/velocityCap, Fps/velocityCap);
    let scalar_a = new Vector2d(Fps/accelerationCap, Fps/accelerationCap);
    //velocity.divide(scalar_v);
    //acceleration.divide(scalar_a);
    boidArray.push( new Boid( '#000000', position, velocity, acceleration, visionRadius, 1, index) );
    
}
        
// CHECK() the status of the game, update all variables. - Called every interval
// Trying to use an adjacency matrix to prevent duplicate edges algorithm is n^2 but limits number of edges that need to be drawn to a reasonable amount
function check() {
    boidArray.forEach(Boid => {
        Boid.boidUpdate();
        
    });
    for(i=0; i<numberBoids; i++)
        for(j=0; j<numberBoids; j++)
            adjacencyMatrix[i][j] = 0;
    if(showConnections) {
        boidArray.forEach(Boid => {
            boidArray.forEach(Other => {
                if(Other != Boid) {
                    let dist = Other.position.distance(Boid.position);
                    if(adjacencyMatrix[Boid.index][Other.index] == 1 && dist < Boid.visionRadius && Other.isInView(Boid.position)) {
                        let v1 = new Vector2d(Other.position.x, Other.position.y);
                        let v2 = new Vector2d(Boid.position.x, Boid.position.y);
                        edgeArray.push(new Edge(v1, v2));
                        adjacencyMatrix[Boid.index][Other.index] == 0;
                    }
                    else if(dist < Boid.visionRadius && Other.isInView(Boid.position) && adjacencyMatrix[Boid.index][Other.index] == 0) {
                        adjacencyMatrix[Boid.index][Other.index] = 1;
                        adjacencyMatrix[Other.index][Boid.index] = 1;
                    }
                }
            });
            
        });
    }
}

function update() {
    drawObjects();
}

function drawObjects() {
    // draw background
    drawRect(0,0,canvas.width,canvas.height,'#b3e6ff');
    // draw boids
    boidArray.forEach(Boid => {
        Boid.drawBoid();
    });

    obstacleArray.forEach(Sphere => {
        Sphere.drawSquare();
    });

    targetArray.forEach(Sphere => {
        Sphere.drawSphere();
    });

    edgeArray.forEach(Edge => {
        Edge.drawLine();
        edgeArray.shift();
    });
}

// Ways to draw objects
function drawRect(x,y,w,h,c) {
    canvasContext.fillStyle = c;
    canvasContext.fillRect(x, y, w, h);
}

function colorCircle(centerX,centerY,radius,drawColor) {
			canvasContext.fillStyle = drawColor
			canvasContext.beginPath();
			canvasContext.arc(centerX,centerY,radius,0,Math.PI*2, true);
            canvasContext.fill();
}



// Helper Functions
function createRandomVector2d(LX,LY,RX,RY) {
    let x = ( Math.random() * (RX - LX + 1) ) + LX;
    let y = ( Math.random() * (RY - LY + 1) ) + LY;
    return new Vector2d(x,y);
}

function checkBounds(a,b,c) {
    if(a < b && b < c)
        return true;
    return false;
}

function distanceToColor(e) {
    let dist = e.v1.distance(e.v2);
    let angle = e.v1.getAngle(e.v2);
    dist = clamp(dist, 0, 255);
    angle = clamp(angle,0,255);
    return rgbToHex(dist, 255-angle, 150); 
}

// Made by random person on stack overflow
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// General clamp function
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}