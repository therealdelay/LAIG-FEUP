function Piece(scene, name, position){
	CGFobject.call(this,scene);
	this.scene = scene;
	this.name = name;
	this.tile = null;
	this.animation = null;
	this.timer = null;
	this.player = null;
	//this.position = position;
	this.boardPosition = null;

	this.piece = this.scene.piecesGraph.pieceNodes[name];
	//this.piece.setIsParent(true);
	this.isParent = true;

	this.material = this.scene.graph.materials[this.piece.materialID];

	this.isSelected = false;
}

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.display = function (currNode, parentMaterial, currTime){
	var currMaterial;
	console.log(currNode.nodeID);
	var leavesLength = currNode.leaves.length;
	var childrenLength = currNode.children.length;
	console.log(currNode.children);
	console.log(currNode.leaves);
	var i;
	var j;

	if(currNode.materialID == "null"){
		currMaterial = parentMaterial;
	} else{
		currMaterial = this.scene.graph.materials[currNode.materialID];
	}

	if(leavesLength > 0)
		currMaterial.apply();

	this.scene.pushMatrix();
	this.scene.multMatrix(currNode.transformMatrix);

	if(this.animation != null && this.isParent){
		this.animation.update(currTime, this.piece);
		this.animation.applyMatrix();
	}

	for(j = 0; j < childrenLength; j++){
		this.display(this.scene.piecesGraph.pieceNodes[currNode.children[j]], currMaterial);
	}

	for(i = 0; i < leavesLength; i++){
		currNode.leaves[i].display();
	}

	this.scene.popMatrix();
};

Piece.prototype.getType = function() {
};

Piece.prototype.getBoardPosition = function() {
};

Piece.prototype.getAnimation = function() {
};