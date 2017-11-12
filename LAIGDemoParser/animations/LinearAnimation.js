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
	
	for(var i = 1; i < this.controlPoints.length; i++){
		this.distance.push(this.getDistance(this.controlPoints[i-1],this.controlPoints[i]));
		this.angleXZ.push(this.getAngleXZ(this.controlPoints[i-1],this.controlPoints[i])/DEGREE_TO_RAD);
		this.angleXY.push(this.getAngleXY(this.controlPoints[i-1],this.controlPoints[i])/DEGREE_TO_RAD);
	}

	console.log(this.controlPoints);
	console.log(this.distance);
	console.log(this.angleXY);
	console.log(this.angleXZ);

	this.translationMatrix = mat4.create();
	mat4.identity(this.translationMatrix);

	/*console.log("speed:::: " + speed);
	console.log("ControlPonts " + controlPoints);*/
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(currTime) {
	var deltaTime = currTime - this.startTime;
	var deltaDist = this.speed * deltaTime;

	if(this.distDone < this.distance[this.index]){
		this.distDone += deltaDist;
		
		var varX = deltaDist * Math.cos(this.angleXY[this.index]);
		var varY = deltaDist * Math.sin(this.angleXY[this.index]);
		var varZ = deltaDist * Math.sin(this.angleXZ[this.index]);

		mat4.translate(this.translationMatrix, this.translationMatrix, [varX, varY, varZ]);
	}

	this.startTime = currTime;
};

LinearAnimation.prototype.getMatrix = function(currTime){
	this.update(currTime);
	return this.translationMatrix;
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