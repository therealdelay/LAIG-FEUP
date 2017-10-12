function MyPatch(scene, degreeU, degreeV, controlvertexes){
	CGFobject.call(this,scene);
	
	var knots1 = this.getKnotsVector(degreeU); // to be built inside webCGF in later versions ()
	var knots2 = this.getKnotsVector(degreeV); // to be built inside webCGF in later versions
		
	var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, knots1, knots2, controlvertexes); // TODO  (CGF 0.19.3): remove knots1 and knots2 from CGFnurbsSurface method call. Calculate inside method.
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.obj = new CGFnurbsObject(this.scene, getSurfacePoint, 20, 20 );
	this.scene.surfaces.push(this.obj);
}

 MyPatch.prototype = Object.create(CGFobject.prototype);
 MyPatch.prototype.constructor=MyPatch;

 MyPatch.prototype.getKnotsVector = function(degree){
 	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
 };

MyPatch.prototype.display = function () {
	console.log('ola');
	this.obj.display;
};

 MyPatch.prototype.setTexCoordsAmp = function (amplif_factor_S, amplif_factor_T) {
 };