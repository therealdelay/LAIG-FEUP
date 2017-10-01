 /**
 * MyRectangle
 * @param gl {WebGLRenderingContext}
 * @constructor 
 */

 function MyRectangle(scene,leftTopX,leftTopY,rightBottomX,rightBottomY) {
 	CGFobject.call(this,scene);
 	
 	this.leftTopX = leftTopX;
 	this.leftTopY = leftTopY;
 	this.rightBottomX = rightBottomX;
 	this.rightBottomY = rightBottomY;

 	this.minS = 0;
 	this.maxS = 1;
 	this.minT = 0;
 	this.maxT = 1;

 	this.deltaX = this.rightBottomX - this.leftTopX;
 	this.deltaY = this.leftTopY - this.rightBottomY;

 	console.log("deltaX", this.deltaX);
 	console.log("deltaY", this.deltaY);

 	console.log("leftTopX", this.leftTopX);
 	console.log("leftTopX", this.leftTopY);
 	console.log("rightBottomX", this.rightBottomX);
 	console.log("rightBottomY", this.rightBottomY);

 	this.initBuffers();
 };

 MyRectangle.prototype = Object.create(CGFobject.prototype);
 MyRectangle.prototype.constructor=MyRectangle;

 MyRectangle.prototype.initBuffers = function () {
 	this.vertices = [
 	this.leftTopX, this.rightBottomY, 0,
 	this.rightBottomX, this.rightBottomY, 0,
 	this.leftTopX, this.leftTopY, 0,
 	this.rightBottomX, this.leftTopY, 0
 	];

 	this.indices = [
 	0, 1, 2,
 	3, 2, 1
 	];


 	this.normals = [
 	0, 0, 1,
 	0, 0, 1,
 	0, 0, 1,
 	0, 0, 1
 	];
 	
 	this.texCoords = [
 	this.minS, this.maxT,
 	this.maxS, this.maxT,
 	this.minS, this.minT,
 	this.maxS, this.minT
 	];

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

 MyRectangle.prototype.setTexCoordsAmp = function (amplif_factor_S, amplif_factor_T) {


 	console.log("vou alterar as texCoords: maxT", this.deltaY/amplif_factor_T);
 	console.log("vou alterar as texCoords: maxS", this.deltaX/amplif_factor_S);
 	console.log("amplif_factor_T", amplif_factor_T);
 	console.log("amplif_factor_S", amplif_factor_S);

 	console.log("deltaX", this.deltaX);
 	console.log("deltaY", this.deltaY);
 	
 	this.texCoords = [
 	0, this.deltaY/amplif_factor_T,
 	this.deltaX/amplif_factor_S, this.deltaY/amplif_factor_T,
 	0, 0,
 	this.deltaX/amplif_factor_S,0
 	];

 	this.updateTexCoordsGLBuffers();
 };