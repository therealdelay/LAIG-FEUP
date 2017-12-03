/**
 * MyPatch
 * @param scene CGFscene where the patch will be displayed
 * @param degreeU - degrees of the splin in u
 * @param degreeV - degrees of the splin in v
 * @param controlvertexes - matrix of control vertexes
 * @constructor
 */
 function MyPatch(scene, partsU, partsV,degreeU, degreeV, controlvertexes){
 	CGFobject.call(this,scene);
 	
 	var knots1 = this.getKnotsVector(degreeU); 
 	var knots2 = this.getKnotsVector(degreeV); 
 	
 	var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, knots1, knots2, controlvertexes); 
 	getSurfacePoint = function(u, v) {
 		return nurbsSurface.getPoint(u, v);
 	};

 	this.obj = new CGFnurbsObject(scene, getSurfacePoint, partsU, partsV);
 }

 MyPatch.prototype = Object.create(CGFobject.prototype);
 MyPatch.prototype.constructor=MyPatch;


/**
* Add to CGFnubsSurface
**/
MyPatch.prototype.getKnotsVector = function(degree){
	var v = new Array();
	for (var i=0; i<=degree; ++i) {
		v.push(0);
	}
	for (var i=0; i<=degree; ++i) {
		v.push(1);
	}

	return v;
};

/**
* Display patch
**/

MyPatch.prototype.display = function () {
	this.obj.display();
};


/**
 * Required because of inheritance but does nothing.
 */
 MyPatch.prototype.setTexCoordsAmp = function (amplif_factor_S, amplif_factor_T) {
 };