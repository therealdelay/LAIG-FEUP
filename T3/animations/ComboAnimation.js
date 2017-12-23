/**
 * ComboAnimation
 * @param scene CGFscene
 * @param id id of the animation
 * @param animations array with the animations from this combo
 * @constructor
 */
function ComboAnimation(scene, id, animations) {
	Animation.call(this);
	this.scene = scene;
	this.id = id;
	this.finish = false;

	this.animations = animations;

	this.index = 0;
	this.currAnimation = this.scene.getAnimation(this.animations[this.index]);
	this.size = animations.length;

	this.transformationMatrix = mat4.create();
};

ComboAnimation.prototype.update = function(currTime) {
};

/**
 * Returns the transformation matrix updated
 */
ComboAnimation.prototype.getMatrix = function(deltaTime){
	if(this.index < this.size){
		this.transformationMatrix = this.currAnimation.getMatrix(deltaTime);
		if(this.currAnimation.finish){
			this.index++;
			if(this.index < this.size){
				this.currAnimation = this.scene.getAnimation(this.animations[this.index]);
				this.currAnimation.deltaTime = 0;
				this.transformationMatrix = this.currAnimation.getMatrix(deltaTime);
			}
		}
	}
		return this.transformationMatrix;		
};

ComboAnimation.prototype.getStatus = function() {
	return this.finish;
};