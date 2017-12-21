function RegularPiece(scene, type, position) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.type = type;
	this.position = position;

	this.body = new MyCylinder(this.scene, 0.4, 0.9, 0.9, 20, 20, 1, 1); //scene, height, botRad, topRad, stacks, slices, top, bottom)
	this.cover = new MySphere(this.scene, 1, 20, 20);

	switch(type){
		case 'black':
			this.material = this.scene.blackMaterial;
			break;
		case 'white':
			this.material = this.scene.whiteMaterial;
			break;
		default:
			break;
	}

	this.startTime = 0;
	this.currAnimation = null;
};

RegularPiece.prototype = Object.create(CGFobject.prototype);
RegularPiece.prototype.constructor=RegularPiece;

RegularPiece.prototype.display = function (position) {
    
    this.scene.pushMatrix();
    	this.material.apply();
    	this.scene.translate(this.position[0],this.position[1],this.position[2]);
        //this.scene.translate(position[0],0,position[1]);
    	this.scene.rotate(-90*DEGREE_TO_RAD, 1,0,0);
    	this.body.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(this.position[0],this.position[1]+0.4,this.position[2]);
        //this.scene.translate(position[0],0.4,position[1]);
    	this.scene.scale(0.9,0.2,0.9);
    	this.cover.display();
    this.scene.popMatrix();
};

RegularPiece.prototype.updateCoords = function (position) {
	this.position = position;
};

RegularPiece.prototype.update = function(currTime){
    // First time
    if(this.startTime == 0){
        this.startTime = currTime;
        return;
    }

   /* console.log(this.position);
    let deltaTime = currTime - this.startTime;
    if(this.currAnimation != null){
        this.animationMatrix = this.currAnimation.getMatrix(deltaTime);
    }
*/
    this.startTime = currTime;
};