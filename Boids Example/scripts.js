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
    constructor(color, position, velocity, acceleration, visionRadius, maxForce) {
        this.color = color;         // HTML Color
        this.position = position;   // Vector2d
        this.velocity = velocity;         // floating point
        this.acceleration = acceleration;   // Vector2d
        this.visionRadius = visionRadius;
        this.turnRadius = 90;
        this.maxForce = 1;
        this.maxSpeed = 4;
        this.lastVisitedTarget = null;
    }


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
            /*desired_velocity - current_velocity*/ 
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
            /*desired_velocity - current_velocity*/ 
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
            /*desired_velocity - current_velocity*/ 
            average.setMagnitude(this.maxSpeed);
            average.subtraction(this.velocity);
            average.limit(new Vector2d(this.maxForce, this.maxForce));
        }
            
    
        return average;
    }

    obstacleAvoidance() {
        let average = new Vector2d(0,0);
        let numNeighbors = 0;
        obstacleArray.forEach(Sphere => {
            let angle = this.position.getAngle(Sphere.position);
            let spherePoint = Sphere.rayCollision(angle);
            

            if(this.position.distance(spherePoint) < this.visionRadius)
                if(Boid != this && this.isInView(spherePoint)) {
                    let dist = this.position.distance(spherePoint);
                    let difference = new Vector2d(1,1);
                    difference.multiplication(this.position);
                    difference.subtraction(spherePoint);
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
		canvasContext.beginPath();
		canvasContext.arc(this.position.x, this.position.y, 4, 0, Math.PI*2, true);
        canvasContext.fill();
        canvasContext.beginPath();
        canvasContext.moveTo(this.position.x, this.position.y);
        canvasContext.lineTo(this.position.x + this.velocity.x*5, this.position.y + this.velocity.y*5);
        canvasContext.stroke();
    }

    flockingAlgorithm() {
        let steeringAlignment = this.alignment();
        let steeringCohesion = this.cohesion();
        let steeringSeparation = this.separation();
        let obAvoid = this.obstacleAvoidance();
        let targetVelocity = this.target();

        this.acceleration.summation(steeringAlignment);
        this.acceleration.summation(steeringCohesion);
        this.acceleration.summation(steeringSeparation);
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
        angle *= (Math.PI/180);
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
       let magnitude;
       let cubicPoint;
        if(315 > angle || (angle >= 0 && angle < 45)) {
            magnitude = (this.position.x + this.radius)/Math.cos(angle);
        }
        else if(checkBounds(45, angle, 135)) {
            magnitude = (this.position.y + this.radius)/Math.sin(angle);
        }
        else if(checkBounds(135, angle, 225)) {
            magnitude = (this.position.x - this.radius)/Math.cos(angle);
        }
        else if(checkBounds(225, angle, 315)) {
            magnitude = (this.position.y - this.radius)/Math.sin(angle);
        }
        else
            magnitude = 1;
        cubicPoint = new Vector2d(magnitude * Math.cos(angle), magnitude * Math.cos(angle));
        return cubicPoint;
    }


    drawSphere() {
        canvasContext.fillStyle = this.color;
        canvasContext.drawRect(this.position.x, this.position.y, this.radius, this.radius, this.color);
    }

}


window.onload = function() {
	canvas = document.getElementById('canvas_boids');
    canvasContext = canvas.getContext('2d');
    //loadExtras();
    for(i=0; i<100; i++) {
        loadInformation();
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
var selectedObstacle = false;
var selectedTarget = false;
var currentMousePosition = 0;

function selectObstacle() {
    selectedObstacle = true;
    selectedTarget = false;
}

function selectTarget() {
    selectedObstacle = false;
    selectedTarget = true;
}

function handleMouseClick() {
    if(selectedTarget) {
        targetArray.push(new Sphere(currentMousePosition, 10, "Red"));
    } else {
        obstacleArray.push(new Square(currentMousePosition, 10, "Black"));
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
    obstacle = new Sphere(position, 10, color);
    return obstacle;
}

function loadExtras() {
    obstacleArray.push(generateObstacle("Black"));
    targetArray.push(generateObstacle("Red"));
}

function loadInformation() {
    LBound = new Vector2d(0, canvas.width);
    RBound = new Vector2d(0, canvas.height);
    let position = createRandomVector2d(LBound.x, RBound.x, LBound.y, RBound.y);
    let velocity = createRandomVector2d(-1,-1,1,1);
    let acceleration = createRandomVector2d(-1,-1,1,1);
    let scalar_v = new Vector2d(Fps/velocityCap, Fps/velocityCap);
    let scalar_a = new Vector2d(Fps/accelerationCap, Fps/accelerationCap);
    //velocity.divide(scalar_v);
    //acceleration.divide(scalar_a);
    boidArray.push( new Boid( '#000000', position, velocity, acceleration, 50, 1) );
}
        
// CHECK() the status of the game, update all variables. - Called every interval
function check() {
    boidArray.forEach(Boid => {
        Boid.boidUpdate();
    });
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
        Sphere.drawSphere();
    })

    targetArray.forEach(Sphere => {
        Sphere.drawSphere();
    })
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