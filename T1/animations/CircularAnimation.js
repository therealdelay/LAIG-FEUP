/**
 * CircularAnimation
 * @param scene CGFscene
 * @param id id of the animation
 * @param speed speed of the animation
 * @param centre centre of the rotation
 * @param radius radius of the rotation
 * @param initAngle initial angle of the rotation
 * @param rotAngle final angle of the rotation
 * @constructor
 */
function CircularAnimation(scene, id, speed, centre, radius, initAngle, rotAngle) {
	Animation.call(this);

	this.id = id;
	// linear speed in distance unit/second
	this.speed = speed;
	this.centre = centre;
	this.radius = radius;
	// initial angle in radians
	this.initAngle = initAngle*DEGREE_TO_RAD;
	this.rotAngle = rotAngle*DEGREE_TO_RAD;
	this.finish = false;

	this.totalDist = 2*Math.PI*this.radius;

	// milliseconds
	this.deltaTime=0;

	// angle velocity in radians per second
	this.vAng = this.speed / this.radius;

	this.currAngle = this.initAngle;

	this.translationMatrix = mat4.create();
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

/**
 * Updates the animation's transformation matrix according to the time that passed since the last update
 * @param deltaTime time that passed since the last update
 */
CircularAnimation.prototype.update = function(deltaTime) {
	if(this.currAngle < this.rotAngle) {

		// delta time since last update in seconds
		this.deltaTime = deltaTime/1000; //to seconds
		// current angle in radians
		this.currAngle += this.vAng*this.deltaTime;

		mat4.identity(this.translationMatrix);
		mat4.translate(this.translationMatrix, this.translationMatrix,this.centre);		//T(cx,cy)
		mat4.rotate(this.translationMatrix, this.translationMatrix,this.currAngle, [0, 1, 0]);//R(DELTAALFA)
		mat4.translate(this.translationMatrix, this.translationMatrix,[this.radius, 0, 0]);		//T(R,0)
	}
	else this.finish = true;
};

/**
 * Returns the transformation matrix updated
 */
CircularAnimation.prototype.getMatrix = function(currTime){
	this.update(currTime);
	return this.translationMatrix;
};