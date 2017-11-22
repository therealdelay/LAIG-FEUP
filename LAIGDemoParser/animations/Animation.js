
function Animation() {
	
	
};

Animation.prototype.contructor = Animation;

Animation.prototype.init = function() {
	this.deltaTime = 0;
};



Animation.prototype.update = function(deltaTime) {
	console.log("Este método tem que ser instanciado nas outras classes!");
};

Animation.prototype.getMatrix = function(deltaTime){};