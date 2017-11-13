
function Animation() {
	
	
};

Animation.prototype.contructor = Animation;

Animation.prototype.init = function() {
	this.startTime = Date.now();
};



Animation.prototype.update = function(currTime) {
	console.log("Este método tem que ser instanciado nas outras classes!");
};

Animation.prototype.getMatrix = function(currTime){};