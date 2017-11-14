function BezierAnimation(scene, id, speed, controlPoints) {
	Animation.call(this);

	console.log("BezierAnimation contructor!!!!!! ");

	this.id = id;
	this.speed = speed;
	this.controlPoints = controlPoints;
	this.p1 = this.controlPoints[0];
	this.p2 = this.controlPoints[1];
	this.p3 = this.controlPoints[2];
	this.p4 = this.controlPoints[3];

	this.time = 0;

	this.lastPoint = vec3.fromValues(this.controlPoints[0][0],this.controlPoints[0][1],this.controlPoints[0][2])

	this.transformationMatrix = mat4.create();

	this.init();
};

BezierAnimation.prototype = Object.create(Animation.prototype);
BezierAnimation.prototype.constructor = BezierAnimation;

BezierAnimation.prototype.update = function(currTime) {
	let deltaTime = currTime - this.startTime;
	console.log(this.time);
	if(this.time < 1){
		this.time += 0.01*this.speed*deltaTime/100;
		let point = this.qfunction(this.time);
		let angle = Math.atan((point[0]-this.lastPoint[0]) / (point[2]-this.lastPoint[2])) + ((point[2]-this.lastPoint[2])<0 ? Math.PI : 0);
		
		this.lastPoint = point;
		mat4.identity(this.transformationMatrix);
		mat4.translate(this.transformationMatrix, this.transformationMatrix,[point[0], point[1], point[2]]);
		mat4.rotate(this.transformationMatrix, this.transformationMatrix,angle, [0, 1, 0]);	
	}
	this.startTime = currTime;
};

BezierAnimation.prototype.getMatrix = function(currTime){
	if(this.time < 1){
		this.update(currTime);
	}
	return this.transformationMatrix;
};

BezierAnimation.prototype.qfunction = function(time){
	let qx = Math.pow(1 - time, 3) * this.p1[0] + 3 * time * Math.pow(1 - time, 2) * this.p2[0] + 3 * Math.pow(time, 2) * (1 - time) * this.p3[0] + Math.pow(time, 3) * this.p4[0];
    let qy = Math.pow(1 - time, 3) * this.p1[1] + 3 * time * Math.pow(1 - time, 2) * this.p2[1] + 3 * Math.pow(time, 2) * (1 - time) * this.p3[1] + Math.pow(time, 3) * this.p4[1];
    let qz = Math.pow(1 - time, 3) * this.p1[2] + 3 * time * Math.pow(1 - time, 2) * this.p2[2] + 3 * Math.pow(time, 2) * (1 - time) * this.p3[2] + Math.pow(time, 3) * this.p4[2];
  	return vec3.fromValues(qx, qy, qz);
}