function CircularAnimation(scene, id, speed, centre, radius, initAngle, rotAngle) {
	Animation.call(this);
	console.log("CircularAnimation contructor!!!!!! ");

	this.id = id;
	this.speed = speed;
	this.centre = centre;
	this.radius = radius;
	this.initAngle = initAngle;
	this.rotAngle = rotAngle;

	console.log("speed:::: " + speed);
	console.log("centre:::: " + centre);
	console.log("radius:::: " + radius);
	console.log("initAngle:::: " + initAngle);
	console.log("rotAngle:::: " + rotAngle);
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function(currTime) {
	
};

CircularAnimation.prototype.getMatrix = function(currTime){
	
};


/*
centerx="ff" centery="ff" centerz="ff"
radius="ff" startang="ff" rotang="ff"
 */