/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/
 function MyGraphLeaf(graph, xmlelem) {
  this.graph = graph;
  this.part = null;
  var type = graph.reader.getItem(xmlelem, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle', 'patch']);
  var args = graph.reader.getString(xmlelem, 'args');

  args = args.split(" ");
  
  switch(type){
    case 'rectangle':
      this.createRectangle(graph, args); break;
    case 'cylinder':
      this.createCylinder(graph, args); break;
    case 'triangle':
      this.createTriangle(graph, args); break;
    case 'sphere':
      this.createSphere(graph, args); break;
    case 'patch':
      this.createPatch(graph, xmlelem, args); break;
    default:
      this.createRectangle(graph, [0,0,0,0]); break;
  }
}


/**
 * Create rectangle
 * @param scene CGFscene where the rectangle will be displayed
 * @param args arguments required by rectangle contructor 
 **/
MyGraphLeaf.prototype.createRectangle = function (graph, args){

  //verify num of args
  if(args.length !== 4)
      console.log("Warning: wrong number of arguments for the rectangle");
    
  this.part = new MyRectangle(graph.scene,args[0],args[1],args[2],args[3]);
}


/**
 * Create cylinder
 * @param scene CGFscene where the cylinder will be displayed
 * @param args arguments required by cylinder contructor 
 **/
MyGraphLeaf.prototype.createCylinder = function (graph, args){

  //verify num of args
  if(args.length !== 7)
    console.log("Warning: wrong number of arguments for the cylinder");
  
  this.part = new MyCylinder(graph.scene,args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
}


/**
 * Create triangle
 * @param scene CGFscene where the triangle will be displayed
 * @param args arguments required by triangle contructor 
 **/
MyGraphLeaf.prototype.createTriangle = function (graph, args){

  //verify num of args
  if(args.length !== 12)
      console.log("Warning: wrong number of arguments for the triangle");
  
   this.part = new MyTriangle(graph.scene,args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10],args[11]);
}


/**
 * Create sphere
 * @param scene CGFscene where the sphere will be displayed
 * @param args arguments required by sphere contructor 
 **/
MyGraphLeaf.prototype.createSphere = function (graph, args){

 //verify num of args
  if(args.length !== 3)
      console.log("Warning: wrong number of arguments for the sphere");
    
   this.part = new MySphere(graph.scene,args[0],args[1], args[2]);
}


/**
 * Create patch
 * @param scene CGFscene where the patch will be displayed
 * @param args arguments required by cylinder contructor 
 **/
MyGraphLeaf.prototype.createPatch = function (graph, xmlelem, args){

  //verify num of args
  if(args.length !== 2)
      console.log("Warning: wrong number of arguments for the patch");
  
   var partsU = parseFloat(args[0]);
   var partsV = parseFloat(args[1]);

   var controlvertexes = [];

   var cplines = xmlelem.children;
   var orderU = cplines.length;
   var orderV;

   for(var i = 0; i < cplines.length; i++){
     var cpoints = cplines[i].children;
     var array = [];
     for(var j=0; j < cpoints.length; j++){
      var cpx = graph.reader.getString(cpoints[j], 'xx');
      var cpy = graph.reader.getString(cpoints[j], 'yy');
      var cpz = graph.reader.getString(cpoints[j], 'zz');
      var cpw = graph.reader.getString(cpoints[j], 'ww');
      var cpointargs = [cpx, cpy, cpz, cpw];
      orderV = cpoints.length;
      array.push(cpointargs);
     }
     controlvertexes.push(array);
   }
   
   this.part = new MyPatch(graph.scene, partsU, partsV, orderU-1, orderV-1, controlvertexes);
}

/**
 * Display leaf
 **/
MyGraphLeaf.prototype.display = function () {
  var tex = this.graph.textures[this.graph.tex_top()] ;

  if(tex != null)
    this.part.setTexCoordsAmp(tex[1], tex[2]);

  this.part.display();
};
