/**
 * MySfere
 * @constructor
 */
function MySphere(scene, radius, slices, stacks) {
   	CGFobject.call(this,scene);
   
   	this.radius = radius;
   	this.slices = slices;
   	this.stacks = stacks;
 
	this.initBuffers();
};
 
MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;
 
MySphere.prototype.initBuffers = function() {
  
 this.vertices = [];
  this.indices = [];
  this.normals = [];
  this.texCoords = [];

  var index = 0;
  
  var ang = 0.0;
  var ang_incr = 2 * Math.PI / this.slices;

  var ang_sphere = 0.0;
  var ang_aux = (Math.PI/2) / this.stacks;

  var height = Math.sin(ang_sphere);
  var coord_x = Math.cos(ang_sphere);
  var coord_y = Math.sin(ang_sphere);

  var index_incr = this.stacks+1;

  for(var i = 0; i <= this.slices; i++) 
  {
    for(var j = 0; j <= this.stacks+1; j++)
    {

      this.vertices.push(coord_x*this.radius, coord_y*this.radius, height*this.radius);
      this.normals.push(2*coord_x, 2*coord_y, 2*height);
      this.texCoords.push((0.5*coord_x) + 0.5,0.5 - (0.5*coord_y));

      if(i !== 0 && j !== 0) {
             this.indices.push(index,index-index_incr-1,index-1);
             this.indices.push(index,index-index_incr,index-index_incr-1);
      }

      index++;
      
      height=Math.sin(ang_sphere);
      coord_x = Math.cos(ang_sphere)* Math.cos(ang);
      coord_y = Math.cos(ang_sphere)*Math.sin(ang);
      ang_sphere+=ang_aux;
      
    }
    ang += ang_incr;
    ang_sphere = 0.0;
    height = 0;
    coord_x = Math.cos(ang);
    coord_y = Math.sin(ang);    
}
	
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
 };

 MySphere.prototype.setTexCoordsAmp = function (amplif_factor_S,amplif_factor_T) {
  /**this.texCoords = [
    0, this.height/amplif_factor_T,
    this.width/amplif_factor_S, this.height/amplif_factor_T,
    this.width/amplif_factor_S, 0,
    0,0
  ];
  this.updateTexCoordsGLBuffers();**/
};