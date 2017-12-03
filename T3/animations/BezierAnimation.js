/**
 * BezierAnimation
 * @param scene CGFscene
 * @param id id of the animation
 * @param speed speed of the animation
 * @param controlPoints control points to guide the animation
 * @constructor
 */
function BezierAnimation(scene, id, speed, controlPoints) {
	Animation.call(this);

	this.id = id;
	this.speed = speed;
	this.controlPoints = controlPoints;
	this.p1 = this.controlPoints[0];
	this.p2 = this.controlPoints[1];
	this.p3 = this.controlPoints[2];
	this.p4 = this.controlPoints[3];
	this.deltaTime = 0;
	this.finish = false;

	this.time = 0;

	this.lastPoint = vec3.fromValues(this.controlPoints[0][0],this.controlPoints[0][1],this.controlPoints[0][2])

	this.transformationMatrix = mat4.create();

	this.init();
};

BezierAnimation.prototype = Object.create(Animation.prototype);
BezierAnimation.prototype.constructor = BezierAnimation;

/**
 * Updates the animation's transformation matrix according to the time that passed since the last update
 * @param deltaTime time that passed since the last update
 */
BezierAnimation.prototype.update = function(deltaTime) {
	this.deltaTime = deltaTime/1000;
	if(this.time < 1){
		this.time += 0.1*this.speed*this.deltaTime;
		let point = this.qfunction(this.time);
		let angle = Math.atan((point[0]-this.lastPoint[0]) / (point[2]-this.lastPoint[2])) + ((point[2]-this.lastPoint[2])<0 ? Math.PI : 0);
		
		this.lastPoint = point;
		mat4.identity(this.transformationMatrix);
		mat4.translate(this.transformationMatrix, this.transformationMatrix,[point[0], point[1], point[2]]);
		mat4.rotate(this.transformationMatrix, this.transformationMatrix,angle, [0, 1, 0]);	
	}
};

/**
 * Returns the transformation matrix updated
 */
BezierAnimation.prototype.getMatrix = function(deltaTime){
	if(this.time < 1){
		this.update(deltaTime);
	}
	else this.finish = true;
	return this.transformationMatrix;
};

/**
 * Returns the current point of the bezier curve
 * @param time
 */
BezierAnimation.prototype.qfunction = function(time){
	let qx = Math.pow(1 - time, 3) * this.p1[0] + 3 * time * Math.pow(1 - time, 2) * this.p2[0] + 3 * Math.pow(time, 2) * (1 - time) * this.p3[0] + Math.pow(time, 3) * this.p4[0];
	let qy = Math.pow(1 - time, 3) * this.p1[1] + 3 * time * Math.pow(1 - time, 2) * this.p2[1] + 3 * Math.pow(time, 2) * (1 - time) * this.p3[1] + Math.pow(time, 3) * this.p4[1];
	let qz = Math.pow(1 - time, 3) * this.p1[2] + 3 * time * Math.pow(1 - time, 2) * this.p2[2] + 3 * Math.pow(time, 2) * (1 - time) * this.p3[2] + Math.pow(time, 3) * this.p4[2];
	return vec3.fromValues(qx, qy, qz);
}