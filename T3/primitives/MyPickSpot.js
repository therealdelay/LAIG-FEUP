function MyPickSpot(scene,id,x,z) {
 	CGFobject.call(this,scene);

    this.scene = scene;
 	this.circle = new MyCircle(scene,20);
 	this.x = x;
 	this.z = z;
	this.id = id;
};

MyPickSpot.prototype = Object.create(CGFobject.prototype);
MyPickSpot.prototype.constructor=MyPickSpot;

MyPickSpot.prototype.display = function(){
    this.scene.pushMatrix();
 	  this.scene.translate(this.x, 0.01, this.z);
 	  this.scene.scale(0.6,0.6,0.6);
 	  this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
 	  this.circle.display();
 	this.scene.popMatrix();
};