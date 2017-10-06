function MyCylinder(scene, height, botRad, topRad, stacks, slices, top, bottom) {
	CGFobject.call(this,scene);
	
	this.height = height/1;
	this.botRad = botRad/1;
	this.topRad = topRad/1;
	this.slices = slices/1;
	this.stacks = stacks/1;
	this.top = top;
	this.bottom = bottom;
	
	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {
	var angle = (2*Math.PI)/this.slices;
	var last = 0;
	var indice = 0;

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	var radius = this.botRad;
	var radDelta = (this.topRad - this.botRad) / this.stacks;
	

	for(s = 0; s <= this.stacks; s++)
	{
		for(i = 0; i <= this.slices; i++)
		{
			last += angle;
			this.vertices.push((radius+s*radDelta)*Math.cos(last), (radius+s*radDelta)*Math.sin(last), this.height*s/this.stacks);
			this.normals.push(Math.cos(last), Math.sin(last), 0);
			this.texCoords.push(i / this.slices, s / this.stacks);
			indice++;

			if(s > 0 && i > 0)
			{
				this.indices.push(indice-1, indice-2, indice-this.slices-2);
				this.indices.push(indice-this.slices-3, indice-this.slices-2, indice-2);
			}
		}
		last = 0;
	}
	

	if(this.top == 1)
		this.addCoverTop();
	
	if(this.bottom == 1)
		this.addCoverBottom();
	
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyCylinder.prototype.setTexCoordsAmp = function (amplif_factor_S,amplif_factor_T) {};

MyCylinder.prototype.addCoverTop = function() {

	var vertices1 = [];
	var indices1 = [];
	var normals1 = [];
	var texCoords1 = [];
	var last = 0;
	var angle = (2*Math.PI)/this.slices;

	vertices1.push(0, 0, this.height);
	normals1.push(0, 0, 1);
	texCoords1.push(0.5, 0.5);

	var num = (this.slices+1)*(this.stacks+1)-1;
	var num2 = (this.slices+1)*(this.stacks)-1;
	for(var i = num; i > num2 ; i--){
		indices1.push(i, num+2, i-1);
		normals1.push(0,0,1);
		texCoords1.push(0.5+0.5*Math.cos(last),0.5-0.5*Math.sin(last));
	}

	this.indices = this.indices.concat(indices1);
	this.normals = this.normals.concat(normals1);
	this.texCoords = this.texCoords.concat(texCoords1);

	
};


MyCylinder.prototype.addCoverBottom = function() {

	var vertices1 = [];
	var indices1 = [];
	var normals1 = [];
	var texCoords1 = [];
	var last = 0;
	var angle = (2*Math.PI)/this.slices;

	normals1.push(0, 0, -1);
	texCoords1.push(0.5, 0.5);

	for(var i = 0; i < this.slices; i++){
		vertices1.push(Math.cos(last)*this.botRad,Math.sin(last)*this.botRad, 0);
		indices1.push(i+1, i, 0);   
		normals1.push(0,0,-1);
		texCoords1.push(0.5+0.5*Math.cos(last),0.5-0.5*Math.sin(last));
		last += angle;
	}
	indices1.push(1, 0, this.slices);

	this.vertices = this.vertices.concat(vertices1);
	this.indices = this.indices.concat(indices1);
	this.normals = this.normals.concat(normals1);
	this.texCoords = this.texCoords.concat(texCoords1);
};