function ComboAnimation(scene, id, animations) {
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

ComboAnimation.prototype.getMatrix = function(deltaTime){

	if(this.index < this.size){

		this.transformationMatrix = this.currAnimation.getMatrix(deltaTime);

		if(this.currAnimation.finish){
			this.index++;
			if(this.index < this.size){
				this.currAnimation = this.scene.getAnimation(this.animations[this.index]);
				this.currAnimation.deltaTime = deltaTime;
				this.transformationMatrix = this.currAnimation.getMatrix(deltaTime);
				console.log("MUDOU PARA NOVA ANIMAÇÃO");

			}
		}

	}

		return this.transformationMatrix;	
	
};