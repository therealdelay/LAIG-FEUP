function Animation() {};

Animation.prototype.contructor = Animation;

Animation.prototype.init = function() {
	this.deltaTime = 0;
};

Animation.prototype.update = function(deltaTime) {
	console.log("Este método tem que ser instanciado nas classes filhas!");
};

Animation.prototype.getMatrix = function(deltaTime){
	console.log("Este método tem que ser instanciado nas classes filhas!");
};