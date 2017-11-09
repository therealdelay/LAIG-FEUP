function BezierAnimation(scene, speed, controlPoints) {
	Animation.call(this);
};

BezierAnimation.prototype = Object.create(Animation.prototype);
BezierAnimation.prototype.constructor = BezierAnimation;

BezierAnimation.prototype.update = function(currTime) {

};