function RegularPiece(scene, player, position) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.player = player;
    this.initialPosition = position;
	this.position = position;
    this.boardPosition = null;

    this.isPlayed = false;
    this.selected = false;

	this.body = new MyCylinder(this.scene, 0.4, 0.9, 0.9, 20, 20, 1, 1); //scene, height, botRad, topRad, stacks, slices, top, bottom)
	this.cover = new MySphere(this.scene, 1, 20, 20);

	switch(player){
		case 'blackPlayer':
			this.material = this.scene.blackMaterial;
			break;
		case 'whitePlayer':
			this.material = this.scene.whiteMaterial;
			break;
		default:
			break;
	}

	this.startTime = 0;
	this.currAnimation = null;
    this.type = 'n';
};

RegularPiece.prototype = Object.create(CGFobject.prototype);
RegularPiece.prototype.constructor=RegularPiece;

RegularPiece.prototype.display = function (position) {
    
    this.scene.pushMatrix();
    	this.material.apply();
    	this.scene.translate(this.position[0],this.position[1],this.position[2]);
    	this.scene.rotate(-90*DEGREE_TO_RAD, 1,0,0);
    	this.body.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(this.position[0],this.position[1]+0.4,this.position[2]);
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
    this.startTime = currTime;
};

RegularPiece.prototype.getType = function() {
    return this.type;
};

RegularPiece.prototype.getAnimation = function() {
    return this.currAnimation;
};

RegularPiece.prototype.getBoardPosition = function() {
    return this.boardPosition;
};