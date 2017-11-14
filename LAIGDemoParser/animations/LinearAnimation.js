var DEGREE_TO_RAD = Math.PI / 180;

function LinearAnimation(scene, id, speed, controlPoints) {
	Animation.call(this);
	console.log("LinearAnimation contructor!!!!!! ");

	this.id = id;
	this.speed = speed;
	this.controlPoints = controlPoints;
	this.finish = false;
	this.startTime = Date.now();

	this.distDone = 0;
	this.index = 0;

	this.distance = [];
	this.angleXZ = [];
	this.vx = [];
	this.vy = [];
	this.vz = [];

	this.totalDistance = 0;
	this.previousPoint = [0, 0, 0];
	
	for(var i = 1; i < this.controlPoints.length; i++){
		var dist = this.getDistance(this.controlPoints[i-1],this.controlPoints[i]);
		this.distance.push(dist);
		this.angleXZ.push(this.getAngleXZ(this.controlPoints[i-1],this.controlPoints[i]));
		this.totalDistance += dist;
		this.vx.push(this.getVX(this.controlPoints[i-1],this.controlPoints[i],dist));
		this.vy.push(this.getVY(this.controlPoints[i-1],this.controlPoints[i],dist));
		this.vz.push(this.getVZ(this.controlPoints[i-1],this.controlPoints[i],dist));
	}
	console.log(this.distance);
	this.transformationMatrix = mat4.create();

	this.init();
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(currTime) {
	var deltaTime = currTime - this.startTime;
	if(this.index < this.distance.length){
		this.deltaX = deltaTime/1000*this.vx[this.index] + this.previousPoint[0];
		this.deltaY = deltaTime/1000*this.vy[this.index] + this.previousPoint[1];
		this.deltaZ = deltaTime/1000*this.vz[this.index] + this.previousPoint[2];
		
		let deltas = vec3.fromValues(this.deltaX, this.deltaY, this.deltaZ);
		let point = vec3.fromValues(this.controlPoints[this.index][0],this.controlPoints[this.index][1],this.controlPoints[this.index][2]);

		if(!isNaN(this.deltaX))
			this.previousPoint[0] = this.deltaX;
		if(!isNaN(this.deltaY))
			this.previousPoint[1] = this.deltaY;
		if(!isNaN(this.deltaZ))
			this.previousPoint[2] = this.deltaZ;
		
		if(vec3.distance(deltas, point) >= this.distance[this.index]){
			this.deltaX = 0;
			this.deltaY = 0;
			this.deltaZ = 0;
			this.index++;
		}
		mat4.identity(this.transformationMatrix);
		mat4.translate(this.transformationMatrix, this.transformationMatrix,[this.deltaX, this.deltaY, this.deltaZ]);
		mat4.rotate(this.transformationMatrix, this.transformationMatrix,this.angleXZ[this.index], [0, 1, 0]);
		this.startTime = currTime;
		console.log(this.angleXZ[this.index]);
	}
	else{
		this.deltaX = 0;
		this.deltaY = 0;
		this.deltaZ = 0;
		this.previousPoint = [0,0,0];
		this.finish = true;
		mat4.identity(this.transformationMatrix);
	}
	
};

LinearAnimation.prototype.getMatrix = function(currTime){
	this.update(currTime);
	return this.transformationMatrix;
};

LinearAnimation.prototype.calculateRotation = function(p1, p2) {
	return Math.atan2(p2[0] - p1[0], p2[2] - p1[2]);
};

LinearAnimation.prototype.getDistance = function(p1, p2){
	let np1 = vec3.fromValues(p1[0],p1[1],p1[2]);
	let np2 = vec3.fromValues(p2[0],p2[1],p2[2]);
	return vec3.distance(np1, np2);
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