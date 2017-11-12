function LinearAnimation(scene, speed, controlPoints) {
	Animation.call(this);
	console.log("LinearAnimation contructor!!!!!! ");

	this.speed = speed;
	this.controlPoints = controlPoints;

	this.distDone = 0;
	this.distance = [];
	this.index = 0;
	this.angle = 0;

	this.angleXZ = [];
	this.angleXY = [];
	
	for(var i = 1; i < controlPoints.size; i++){
		this.distance.push(this.getDistance(controlPoints[i-1],controlPoints[i]));
		this.angleXZ.push(this.getAngleXZ(controlPoints[i-1],controlPoints[i]));
		this.angleXY.push(this.getAngleXY(controlPoints[i-1],controlPoints[i]));
	}

	console.log(controlPoints.length);
	console.log(this.distance.length);
	console.log(this.angleXY.length);
	console.log(this.angleXZ.length);

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
}

LinearAnimation.prototype.getDistance = function(p1, p2){
	return Math.sqrt(Math.pow(p2[0] - p1[0], 2) +
		 			 Math.pow(p2[1] - p1[1], 2) +
		 			 Math.pow(p2[2] - p1[2], 2));
}

LinearAnimation.prototype.getAngleXZ = function(p1, p2){
	var dx = p2[0]-p1[0];
	var dz = p2[2]-p1[2];
	return alfa = Math.acos(dx/(Math.pow(dx,2) + Math.pow(dz,2)));
}

LinearAnimation.prototype.getAngleXY = function(p1, p2){
	var dx = p2[0]-p1[0];
	var dy = p2[1]-p1[1];
	return alfa = Math.acos(dx/(Math.pow(dx,2) + Math.pow(dy,2)));
}