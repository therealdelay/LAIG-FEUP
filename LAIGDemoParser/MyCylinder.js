function MyCylinder(scene, height, botRad, topRad, stacks, slices) {
	CGFobject.call(this,scene);
	
	this.height = height;
	this.botRad = botRad/1;
	this.topRad = topRad/1;
	this.slices = slices;
	this.stacks = stacks;
	
	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {
 	var angle = (2*Math.PI)/this.slices;
 	var last = 0;

    this.vertices = [];
 	this.indices = [];
 	this.normals = [];
	this.texCoords = [];
	var radius = this.botRad;
	var radDelta = (this.topRad - this.botRad) / this.stacks;
	console.log("RAIO");
	console.log(radius);
 	indice = 0;

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
	
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};