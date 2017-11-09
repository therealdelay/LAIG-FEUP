function CircularAnimation(scene, speed, centre, radius, initAngle, rotAngle) {
	Animation.call(this);
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function(currTime) {
	
};