function ComboAnimation(scene, id, animations) {
	console.log("animations COMBO!!! " + animations);

	Animation.call(this);
	this.scene = scene;
	this.id = id;

	this.animations = animations;

	this.index = 0;
	this.currAnimation = this.scene.getAnimation(this.animations[this.index]);
	this.size = animations.length;

	this.transformationMatrix = mat4.create();

};

ComboAnimation.prototype.update = function(currTime) {
};

ComboAnimation.prototype.getMatrix = function(currTime){



	console.log("[this.size]:::::::" + this.size);
	console.log("[this.index]:::::::" + this.index);
	console.log("this.animations[this.index]:::::::" + this.currAnimation.id);


	if(this.index < this.size){

		this.transformationMatrix = this.currAnimation.getMatrix(currTime);

		if(this.currAnimation.finish){
			this.index++;
			if(this.index < this.size){
				this.currAnimation = this.scene.getAnimation(this.animations[this.index]);
				this.currAnimation.starTime = Date.now();
				console.log("MUDOU PARA NOVA ANIMAÇÃO");

			}
		}

	}

		return this.transformationMatrix;	
	
};