function BezierAnimation(scene, speed, controlPoints) {
	Animation.call(this);

	console.log("BezierAnimation contructor!!!!!! ");

	this.speed = speed;
	this.controlPoints = controlPoints;

	console.log("speed:::: " + speed);
	console.log("ControlPonts " + controlPoints);
};

BezierAnimation.prototype = Object.create(Animation.prototype);
BezierAnimation.prototype.constructor = BezierAnimation;

BezierAnimation.prototype.update = function(currTime) {

};