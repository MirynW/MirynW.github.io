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
            this.x = dVector.x * signY;
        if(this.y * signY > dVector.y)
            this.y = dVector.y * signY;
    }
    setMagnitude(newMagnitude) {
        let currentMagnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x = this.x * newMagnitude / currentMagnitude;
        this.y = this.y * newMagnitude / currentMagnitude;
    }
}

class Boid {
    constructor(color, position, velocity, acceleration, visionRadius, maxForce) {
        this.color = color;         // HTML Color
        this.position = position;   // Vector2d
        this.velocity = velocity;         // floating point
        this.acceleration = acceleration;   // Vector2d
        this.visionRadius = visionRadius;
        this.maxForce = maxForce;
        this.maxSpeed = 4;
    }


    // Alignment
    alignment() {
        let average = new Vector2d(0,0);
        let numNeighbors = 0;
        boidArray.forEach(Boid => {
            if(this.position.distance(Boid.position) < this.visionRadius)
                if(Boid != this) {
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
                if(Boid != this) {
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
                if(Boid != this) {
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



    // Can change later but in general draws a boid to the canvas
    drawBoid() {
        canvasContext.fillStyle = '#000000';
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

        this.acceleration.summation(steeringAlignment);
        this.acceleration.summation(steeringCohesion);
        this.acceleration.summation(steeringSeparation);
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

class Obstacle {
    constructor(position, size, shape) {
        this.position = position;
    }
}


window.onload = function() {
	canvas = document.getElementById('canvas_boids');
    canvasContext = canvas.getContext('2d');
    for(i=0; i<100; i++) {
        loadInformation();
    }
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