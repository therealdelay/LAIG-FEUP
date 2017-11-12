
function Animation() {
	
	
};

Animation.prototype.contructor = Animation;

Animation.prototype.init = function() {
	var d = new Date();
	this.startTime = d.getTime();
};



Animation.prototype.update = function(currTime) {
	console.log("Este método tem que ser instanciado nas outras classes!");
};