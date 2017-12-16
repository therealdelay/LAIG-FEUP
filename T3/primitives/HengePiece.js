function HengePiece(scene, player, position) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.player = player;
	this.position = position;

	this.material1 = this.scene.whiteMaterial;
	this.material2 = this.scene.blackMaterial;

	this.body = new MyCylinder(this.scene, 0.4, 0.9, 0.9, 20, 20, 1, 1);
	this.coverPart1 = new MySphere(this.scene, 1, 20, 20);
	this.coverPart2 = new MySphere(this.scene, 1, 20, 20);
};

HengePiece.prototype = Object.create(CGFobject.prototype);
HengePiece.prototype.constructor=HengePiece;

HengePiece.prototype.display = function () {
    
    this.scene.pushMatrix();
    	this.material1.apply();
    	this.scene.translate(this.position[0],0,this.position[1]);
    	this.scene.rotate(-90*DEGREE_TO_RAD, 1,0,0);
    	this.body.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    	this.material1.apply();
    	this.scene.translate(this.position[0],0.4,this.position[1]);
    	this.scene.scale(0.9,0.2,0.9);
    	this.coverPart1.display();
    this.scene.popMatrix();
 
    this.scene.pushMatrix();
    	this.material2.apply();
    	this.scene.translate(this.position[0],0.4,this.position[1]);
    	this.scene.scale(0.6,0.25,0.6);
    	this.scene.rotate(-90*DEGREE_TO_RAD, 1,0,0);
    	this.coverPart2.display();
    this.scene.popMatrix();
};

HengePiece.prototype.updateCoords = function (position){
    this.position = position;
}