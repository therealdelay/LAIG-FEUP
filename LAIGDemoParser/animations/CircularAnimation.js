function CircularAnimation(scene, id, speed, centre, radius, initAngle, rotAngle) {
	Animation.call(this);
	console.log("CircularAnimation contructor!!!!!! ");

	this.id = id;
	// linear speed in distance unit/second
	this.speed = speed;
	this.centre = centre;
	this.radius = radius;
	// initial angle in radians
	this.initAngle = initAngle*DEGREE_TO_RAD;
	this.rotAngle = rotAngle*DEGREE_TO_RAD;

	this.totalDist = 2*Math.PI*this.radius;

	// milliseconds
	this.startTime = Date.now();

	// angle velocity in radians per second
	this.vAng = this.speed / this.radius;

	this.currAngle = this.initAngle;

	this.translationMatrix = mat4.create();
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function(currTime) {
	if(this.currAngle < this.rotAngle) {

	// delta time since last update in seconds
	var deltaTime = (currTime - this.startTime)/1000; //to seconds
	// current angle in radians
	console.log("currAngle::::::::::::::::::::::::::::::" + this.currAngle);
	console.log("rotAngle:::::::::::::::::::::::::::::::" + this.rotAngle);
	
		this.currAngle += this.vAng*deltaTime;

		mat4.identity(this.translationMatrix);
		mat4.translate(this.translationMatrix, this.translationMatrix,[this.centre[0], this.centre[1], 0]);		//T(cx,cy)
		mat4.rotate(this.translationMatrix, this.translationMatrix,this.currAngle, [0, 1, 0]);//R(DELTAALFA)
		mat4.translate(this.translationMatrix, this.translationMatrix,[this.radius, 0, 0]);		//T(R,0)
		mat4.rotate(this.translationMatrix, this.translationMatrix,90*DEGREE_TO_RAD, [1, 0, 0]); //R(90)
	}
this.startTime = currTime;
};

CircularAnimation.prototype.getMatrix = function(currTime){
	this.update(currTime);
	return this.translationMatrix;
};