/**
 * MyTriangle
 * @param scene CGFscene where the triangle will be displayed
 * @param vert1X coordinate x of vertice 1
 * @param vert1Y coordinate y of vertice 1
 * @param vert1Z coordinate z of vertice 1
 * @param vert2X coordinate x of vertice 2
 * @param vert2Y coordinate y of vertice 2
 * @param vert2Z coordinate z of vertice 2
 * @param vert3X coordinate x of vertice 3
 * @param vert3Y coordinate y of vertice 3
 * @param vert3Z coordinate z of vertice 3
 * @constructor
 */
 function MyTriangle(scene, vert1X, vert1Y, vert1Z, vert2X, vert2Y, vert2Z, vert3X, vert3Y, vert3Z) {
 	CGFobject.call(this,scene);

 	this.vert1X = vert1X;
 	this.vert1Y = vert1Y;
 	this.vert1Z = vert1Z;
 	this.vert2X = vert2X;
 	this.vert2Y = vert2Y;
 	this.vert2Z = vert2Z;
 	this.vert3X = vert3X;
 	this.vert3Y = vert3Y;
 	this.vert3Z = vert3Z;

 	this.minS = 0;
 	this.maxS = 1;
 	this.minT = 0;
 	this.maxT = 1;

 	this.initBuffers();
 };

 MyTriangle.prototype = Object.create(CGFobject.prototype);
 MyTriangle.prototype.constructor=MyTriangle;

/**
 * Initializes the triangle  - vertices, indices, normals and texCoords.
 */
 MyTriangle.prototype.initBuffers = function () {
 	this.vertices = [
 	this.vert1X, this.vert1Y, this.vert1Z,
 	this.vert2X, this.vert2Y, this.vert2Z,
 	this.vert3X, this.vert3Y, this.vert3Z
 	];

 	this.indices = [
 	0, 1, 2,
 	];

 	this.normals = [];

 	this.a = (this.vert2Y-this.vert1Y)*(this.vert3Z-this.vert1Z) - (this.vert2Z-this.vert1Z)*(this.vert3Y-this.vert1Y);
 	this.b = (this.vert2Z-this.vert1Z)*(this.vert3X-this.vert1X) - (this.vert2X-this.vert1X)*(this.vert3Z-this.vert1Z);
 	this.c = (this.vert2X-this.vert1X)*(this.vert3Y-this.vert1Y) - (this.vert2Y-this.vert1Y)*(this.vert3X-this.vert1X);

 	for (let j = 0; j < 3; j++){
 		this.normals.push(this.a);
 		this.normals.push(this.b);
 		this.normals.push(this.c);
 	}

 	this.texCoords = [
 	this.minS, this.maxT,
 	this.maxS, this.maxT,
 	this.minS, this.minT,
 	this.maxS, this.minT
 	];

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

 
 /**
 * Updates the coordinates of the textures according to amplification factor of texture.
 */
 MyTriangle.prototype.setTexCoordsAmp = function (amplif_factor_S,amplif_factor_T) {
 	var distAB = Math.sqrt(Math.pow(this.vert2X-this.vert1X, 2) + Math.pow(this.vert2Y-this.vert1Y, 2) + Math.pow(this.vert2Z-this.vert1Z, 2));
 	var distBC = Math.sqrt(Math.pow(this.vert2X-this.vert3X, 2) + Math.pow(this.vert2Y-this.vert3Y, 2) + Math.pow(this.vert2Z-this.vert3Z, 2));
 	var distAC = Math.sqrt(Math.pow(this.vert1X-this.vert3X, 2) + Math.pow(this.vert1Y-this.vert3Y, 2) + Math.pow(this.vert1Z-this.vert3Z, 2));
 	var beta = Math.acos((Math.pow(distBC, 2) + Math.pow(distAB, 2) - Math.pow(distAC, 2))/(2*distAB*distBC));

 	this.texCoords = [
 	this.minS, this.minT,
 	this.maxS, this.minT*distAB/amplif_factor_S,
 	((distAB - distBC*Math.cos(beta))/distAB)*distAB/amplif_factor_S, (distBC*Math.sin(beta)/distAB)*distAB/amplif_factor_T
 	];	

 	this.updateTexCoordsGLBuffers();
 };