/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/

 function MyGraphLeaf(graph, xmlelem) {
  this.graph = graph;
  this.part = null;
  var type = graph.reader.getItem(xmlelem, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle', 'patch']);
  var args = graph.reader.getString(xmlelem, 'args');

 // console.log("isto são args", args);

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

MyGraphLeaf.prototype.createRectangle = function (graph, args){
  if(args.length !== 4){
      console.log("Warning: wrong number of arguments for the rectangle");
    }
  this.part = new MyRectangle(graph.scene,args[0],args[1],args[2],args[3]);
}

MyGraphLeaf.prototype.createCylinder = function (graph, args){
  if(args.length !== 7){
    console.log("Warning: wrong number of arguments for the cylinder");
  }
  this.part = new MyCylinder(graph.scene,args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
}

MyGraphLeaf.prototype.createTriangle = function (graph, args){
  if(args.length !== 12){
      console.log("Warning: wrong number of arguments for the triangle");
    }
   this.part = new MyTriangle(graph.scene,args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10],args[11]);
}

MyGraphLeaf.prototype.createSphere = function (graph, args){
  if(args.length !== 3){
      console.log("Warning: wrong number of arguments for the sphere");
    }
   this.part = new MySphere(graph.scene,args[0],args[1], args[2]);
}

MyGraphLeaf.prototype.createPatch = function (graph, xmlelem, args){
  if(args.length !== 2){
      console.log("Warning: wrong number of arguments for the patch");
    }
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

   //console.log(controlvertexes );

   this.part = new MyPatch(graph.scene, orderU-1, orderV-1, controlvertexes);

}

MyGraphLeaf.prototype.display = function () {

  var tex = this.graph.textures[this.graph.tex_top()] ;

  if(tex != null)
    this.part.setTexCoordsAmp(tex[1], tex[2]);

  this.part.display();
};
