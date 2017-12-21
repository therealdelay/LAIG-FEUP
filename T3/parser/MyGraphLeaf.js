/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/
 function MyGraphLeaf(graph, xmlelem) {
  this.graph = graph;
  this.part = null;
  var type = graph.reader.getItem(xmlelem, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle', 'patch', 'peca', 'henge']);
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
    case 'peca':
      this.createPiece(graph, args); break;
    case 'henge':
      this.createHenge(graph, args); break;
    default:
      this.createRectangle(graph, [0,0,0,0]); break;
  }
}

MyGraphLeaf.prototype.createPiece = function (graph, args){

  this.part = new RegularPiece(graph.scene, args[0]);
}

MyGraphLeaf.prototype.createHenge = function (graph, args){

  this.part = new HengePiece(graph.scene, args[0]);
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

  if(this.part instanceof RegularPiece){
    if(this.part.type == 'black'){
      var x = -15;
      var z = -8;
      for(var i = 0; i < 10; i++){
        this.part.display([x,z]);
        if(x > -15){
            x = -15;
            z += 2;
        }
        else
            x += 2;
      }
    }
    else if(this.part.type == 'white'){
      var x = 13;
      var z = -8;
      for(var i = 0; i < 10; i++){
        this.part.display([x,z]);
        if(x > 13){
            x = 13;
            z += 2;
        }
        else
            x += 2;
      }
    }
  }
  else if(this.part instanceof HengePiece){
    console.log('Henge');
    console.log(this.part);
    var xw = 13;
    var zw = 2;
    var xb = -15;
    var zb = 2;
    for(var i = 0; i < 2; i++){
      if(this.part.player == 'white'){
        this.part.display([xw,zw]);
        if(xw > 13){
            xw = 13;
            zw += 2;
        }
        else
            xw += 2;
      }
      else if(this.part.player == 'black'){
        this.part.display([xb,zb]);
        if(xb > -15){
            xb = -15;
            zb += 2;
        }
        else
            xb += 2;
      }
    }
    if(this.part.player == 'white')
        this.part.display([xw,zw]);
  }
  else
    this.part.display();
};
