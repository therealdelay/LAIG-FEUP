var DEGREE_TO_RAD = Math.PI / 180;

function LinearAnimation(scene, id, speed, controlPoints) {
	Animation.call(this);
	console.log("LinearAnimation contructor!!!!!! ");

	this.id = id;
	this.speed = speed;
	this.controlPoints = controlPoints;

	this.distDone = 0;
	this.distance = [];
	this.index = 0;
	this.angle = 0;

	this.angleXZ = [];
	this.angleXY = [];

	this.previousPoint = 0;

	/*
	for(var i = 1; i < this.controlPoints.length; i++){
		this.distance.push(this.getDistance(this.controlPoints[i-1],this.controlPoints[i]));
		this.angleXZ.push(this.getAngleXZ(this.controlPoints[i-1],this.controlPoints[i])/DEGREE_TO_RAD);
		this.angleXY.push(this.getAngleXY(this.controlPoints[i-1],this.controlPoints[i])/DEGREE_TO_RAD);
	}

	mat4.identity(this.translationMatrix);
	this.translationMatrix = mat4.create();


	console.log(this.controlPoints);
	console.log(this.distance);
	console.log(this.angleXY);
	console.log(this.angleXZ); 

	*/

	console.log("Control Points " + this.controlPoints);
	console.log("point 1 " + this.controlPoints);
	console.log("point 2 " + this.controlPoints);

	var dist = this.getDistance(this.controlPoints[0], this.controlPoints[1]);

	console.log("Dist " + dist);

	var cosA = (this.controlPoints[1][0]-this.controlPoints[0][0]) / dist;
	this.vx = this.speed * cosA;

	var senA = (this.controlPoints[1][1]-this.controlPoints[0][1]) / dist;
	this.vy = this.speed * senA;

	this.translationMatrix = mat4.create();
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(currTime) {
	var deltaTime = currTime - this.startTime;
	var deltaDist = this.speed * deltaTime;
	
	this.deltaX = deltaTime*this.vx;
	this.deltaY = deltaTime*this.vy;

	//var AB = vec2.fromValues(this.controlPoints[this.previousPoint+1][0]-this.controlPoints[this.previousPoint][0], this.controlPoints[this.previousPoint+1][2]-this.controlPoints[this.previousPoint][2]);

	var AB = vec2.fromValues(this.controlPoints[1][0]-this.controlPoints[0][0], this.controlPoints[1][1]-this.controlPoints[0][1]);

	var BC = vec2.fromValues(0,1);

	this.rot_ang = Math.acos(((AB[0]*BC[0])+(AB[1]*BC[1]))/ (Math.sqrt(Math.pow(AB[0],2)+Math.pow(AB[1],2))+
		Math.sqrt(Math.pow(BC[0],2)+Math.pow(BC[1],2))))*(180/Math.PI);


	mat4.identity(this.translationMatrix);
	mat4.translate(this.translationMatrix, this.translationMatrix,[this.deltaX, this.deltaY, 0]);
	mat4.rotate(this.translationMatrix, this.translationMatrix,this.rot_ang, [0, 1, 0]);

	this.startTime = currTime;
};

LinearAnimation.prototype.getMatrix = function(currTime){
	this.update(currTime);
	return this.translationMatrix;
};

LinearAnimation.prototype.calculateRotation = function(p1, p2) {
	return Math.atan2(p2[0] - p1[0], p2[2] - p1[2]);
};

LinearAnimation.prototype.getDistance = function(p1, p2){
	return Math.sqrt(Math.pow(p2[0] - p1[0], 2) +
		Math.pow(p2[1] - p1[1], 2) +
		Math.pow(p2[2] - p1[2], 2));
};

LinearAnimation.prototype.getAngleXZ = function(p1, p2){
	var dx = p2[0]-p1[0];
	var dz = p2[2]-p1[2];
	var ax = Math.pow(dx,2);
	var az = Math.pow(dz,2);
	var norm = Math.sqrt(ax + az);
	if(norm === 0)
		return 0;
	return Math.acos(dx/norm);
};

LinearAnimation.prototype.getAngleXY = function(p1, p2){
	var dx = p2[0]-p1[0];
	var dy = p2[1]-p1[1];
	var ax = Math.pow(dx,2);
	var ay = Math.pow(dy,2);
	var norm = Math.sqrt(ax + ay);
	if(norm === 0)
		return 0;
	return Math.acos(dx/norm);
};