/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/

 function MyGraphLeaf(graph, xmlelem) {
  this.graph = graph;
  this.part = null;
  var type = graph.reader.getItem(xmlelem, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle']);
  var args = graph.reader.getString(xmlelem, 'args');

  console.log("isto são args", args);

  args = args.split(" ");

  if(type == 'rectangle'){
    this.part = new MyRectangle(graph.scene,args[0],args[1],args[2],args[3]);
  }
  else if(type == 'cylinder'){
   this.part = new MyCylinder(graph.scene,args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
 }
 else if(type == 'triangle'){
   this.part = new MyTriangle(graph.scene,args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10],args[11]);
 }
 else if(type == 'sphere'){
   this.part = new MySphere(graph.scene,args[0],args[1], args[2], args[3]);
 }
 else{
   this.part = new MyRectangle(graph.scene,0,0,0,0);
 }
}


MyGraphLeaf.prototype.display = function () {

  var tex = this.graph.textures[this.graph.tex_top()] ;

  if(tex != null)
    this.part.setTexCoordsAmp(tex[1], tex[2]);

  this.part.display();
};
