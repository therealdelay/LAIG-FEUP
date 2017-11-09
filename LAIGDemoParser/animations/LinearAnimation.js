function LinearAnimation(scene, speed, controlPoints) {
	Animation.call(this);
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function(currTime) {
	
};