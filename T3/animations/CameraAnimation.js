var DEG_TO_RAD = Math.PI / 180;

function CameraAnimation(scene, startView, endView) {
	Animation.call(this);

	this.speed = 5;
	this.centre = [7.5,7.5,0];
	this.radius = 15;
	this.initAngle = 0;
	this.endAngle = 0;
	this.initPos = [0,0,0];
	this.endPos = [0,0,0];
	switch(startView){
	    case 'ai':
	       this.initAngle = 90*DEG_TO_RAD;
	       this.initPos = [1,15,15];
	       break;
	    case 'black':
	       this.initAngle = 0*DEG_TO_RAD;
	       this.initPos = [-15,15,1];
	       break;
	    case 'white':
	       this.initAngle = 180*DEG_TO_RAD;
	       this.initPos = [15,15,1];
	       break;
	    default:
	       this.initAngle = 90*DEG_TO_RAD;
	       this.initPos = [1,15,15];
	       break;
	}
	switch(endView){
	    case 'ai':
	       this.endAngle = 90*DEG_TO_RAD;
	       this.endPos = [1,15,15];
	       break;
	    case 'black':
	       this.endAngle = 0*DEG_TO_RAD;
	       this.endPos = [-15,15,1];
	       break;
	    case 'white':
	       this.endAngle = 180*DEG_TO_RAD;
	       this.endPos = [15,15,1];
	       break;
	    default:
	       this.endAngle = 90*DEG_TO_RAD;
	       this.endPos = [1,15,15];
	       break;
	}

	this.totalDist = 2*Math.PI*this.radius;

	this.vAng = this.speed / this.radius;

	this.currAngle = this.initAngle;
	this.finish = false;
};

CameraAnimation.prototype = Object.create(Animation.prototype);
CameraAnimation.prototype.constructor = CameraAnimation;

/**
 * Updates the animation's transformation matrix according to the time that passed since the last update
 * @param deltaTime time that passed since the last update
 */
CameraAnimation.prototype.update = function(deltaTime) {
	if(this.currAngle < this.endAngle) {
		this.deltaTime = deltaTime/1000;
		
		this.currAngle += this.vAng*deltaTime;

		this.initPos = [this.initPos[0]+Math.cos(this.currAngle), this.initPos[1]+Math.sin(this.currAngle), 0];
	}
	else this.finish = true;

	return this.initPos;
};
