var DEGREE_TO_RAD = Math.PI / 180;

function LinearAnimation(scene, id, speed, controlPoints) {
	Animation.call(this);
	console.log("LinearAnimation contructor!!!!!! ");

	this.id = id;
	this.speed = speed;
	this.controlPoints = controlPoints;

	this.distDone = 0;
	this.index = 0;

	this.distance = [];
	this.angleXZ = [];
	this.angleXY = [];
	this.vx = [];
	this.vy = [];
	this.vz = [];

	let totalDistance = 0;
	this.previousPoint = [0, 0, 0];
	
	for(var i = 1; i < this.controlPoints.length; i++){
		var dist = this.getDistance(this.controlPoints[i-1],this.controlPoints[i]);
		this.distance.push(dist);
		this.angleXZ.push(this.getAngleXZ(this.controlPoints[i-1],this.controlPoints[i])/DEGREE_TO_RAD);
		this.angleXY.push(this.getAngleXY(this.controlPoints[i-1],this.controlPoints[i])/DEGREE_TO_RAD);
		this.totalDistance += dist;
		this.vx.push(this.getVX(this.controlPoints[i-1],this.controlPoints[i],dist));
		this.vy.push(this.getVY(this.controlPoints[i-1],this.controlPoints[i],dist));
		this.vz.push(this.getVZ(this.controlPoints[i-1],this.controlPoints[i],dist));
	}
	
	this.translationMatrix = mat4.create();
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(currTime) {
	var deltaTime = currTime - this.startTime;

	if(this.index < this.distance.length){
		this.deltaX = deltaTime/100*this.vx[this.index] + this.previousPoint[0];
		this.deltaY = deltaTime/100*this.vy[this.index] + this.previousPoint[1];
		this.deltaZ = deltaTime/100*this.vz[this.index] + this.previousPoint[2];

		if(!isNaN(this.deltaX))
			this.previousPoint[0] = this.deltaX;
		if(!isNaN(this.deltaY))
			this.previousPoint[1] = this.deltaY;
		if(!isNaN(this.deltaZ))
			this.previousPoint[2] = this.deltaZ;

		if(this.distDone >= this.distance[this.index]){
			this.index++;
		}
		mat4.identity(this.translationMatrix);
		mat4.translate(this.translationMatrix, this.translationMatrix,[this.deltaX, this.deltaY, this.deltaZ]);
		mat4.rotate(this.translationMatrix, this.translationMatrix,this.angleXZ[this.index], [0, 1, 0]);
	}
	else{
		this.deltaX = 0;
		this.deltaY = 0;
		this.deltaZ = 0;
		this.previousPoint = [0,0,0];
		mat4.identity(this.translationMatrix);
	}
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

LinearAnimation.prototype.getVX = function(p1, p2, dist){
	var cosA = (p2[0]-p1[0]) / dist;
	return this.speed * cosA;
}

LinearAnimation.prototype.getVY = function(p1, p2, dist){
	var senA = (p2[1]-p1[1]) / dist;
	return this.speed * senA;
}

LinearAnimation.prototype.getVZ = function(p1, p2, dist){
	var senA = (p2[2]-p1[2]) / dist;
	return this.speed * senA;
}