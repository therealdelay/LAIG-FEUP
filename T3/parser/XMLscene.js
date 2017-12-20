var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface) {
    CGFscene.call(this);

    this.interface = interface;
	this.currentNode = null;
	this.nodesToShade = [];
	this.scaleFactor=50.0;
	this.tempScaleFactor=50.0;
	this.selectable=false;
	this.sinTime = -Math.PI/2;
	this.R = 1;
	this.tempR = 1;
	this.cam = [0,0,0];
	this.currentView = 'ai';
	this.lastCamTime = 0;
    this.finalPos = [0,0,0];
    this.moveCam = false;

    var d = new Date();

    this.initialTime = d.getTime();

    this.lightValues = {};
	this.quadrados = [];
	this.pieces = [];
    this.pickableID = 0;
    this.currentPiece = null;

    this.Game = new Game(this);
    this.WhitePlayer = null;
    this.BlackPlayer = null;
    this.isConfiguredPlayerWhite = false;
    this.isConfiguredPlayerBlack = false;
    this.gamePlayerOptions = ['Human', 'Easy Bot', 'Hard Bot'];
};

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.logPicking = function (){
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj){
					var customId = this.pickResults[i][1];				
					//console.log("Picked object: " + obj + ", with pick id " + customId);

                    if(this.pickResults[i][0] instanceof RegularPiece){
                        if(this.pickResults[i][0].type == 'black'){
                            this.currentPiece = this.pieces[customId-1];
                        }
                        else{
                            this.currentPiece = this.pieces[customId-1];
                        }
                    }
                    else if(this.pickResults[i][0] instanceof HengePiece){
                        this.currentPiece = this.pieces[customId-1];
                    }

                    if(this.currentPiece !== null){
                        if(this.pickResults[i][0] instanceof MySquare){
                            this.currentPiece.updateCoords([this.pickResults[i][0].x,this.pickResults[i][0].z]);
                            this.currentPiece = null;
                        }
                    }
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
};

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);
    
    this.camera = new CGFcamera(0.35,0.5,500,[0,15,15],[0,0,0]);

    this.enableTextures(true);
    
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.setUpdatePeriod(1000/60);

	this.shader = new CGFshader(this.gl, "shaders/scaler.vert", "shaders/scaler.frag");
	this.shader.setUniformsValues({R: this.tempR});
	this.updateScaleFactor();

    this.axis = new CGFaxis(this);

    this.setPickEnabled(true);
    this.createPickableSquares();	
	this.materialDefault = new CGFappearance(this);

	this.whiteMaterial = new CGFappearance(this);
	this.whiteMaterial.setAmbient(0.2,0.2,0.2,1);
	this.whiteMaterial.setDiffuse(0.5,0.5,0.5,1);
	this.whiteMaterial.setSpecular(0.2,0.2,0.2,1);
	this.whiteMaterial.setShininess(1);   

	this.darkMaterial = new CGFappearance(this);
	this.darkMaterial.setAmbient(0,0,0,1);
	this.darkMaterial.setDiffuse(0,0,0,1);
	this.darkMaterial.setSpecular(0,0,0,1);
	this.darkMaterial.setShininess(0);

    this.redMaterial = new CGFappearance(this);
    this.redMaterial.setAmbient(0,0,0,1);
    this.redMaterial.setDiffuse(0.5,0,0,1);
    this.redMaterial.setSpecular(0.8,0,0,0.5);
    this.redMaterial.setShininess(0.3);   

    this.blackMaterial = new CGFappearance(this);
    this.blackMaterial.setAmbient(0,0,0,1);
    this.blackMaterial.setDiffuse(0,0,0,1);
    this.blackMaterial.setSpecular(0.1,0.1,0.1,0.5);
    this.blackMaterial.setShininess(0.3);   

    this.createPieces();
};

XMLscene.prototype.createPieces = function() {
    var x = -15;
    var z = -8;
    for(var i = 0; i < 10; i++){
        this.pieces.push(new RegularPiece(this,'black',[x,z]));
        this.pieces.push(new RegularPiece(this,'white',[x+28,z]));
        if(x > -15){
            x = -15;
            z += 2;
        }
        else
            x += 2;
    }

    for(var j = 0; j < 2; j++){
        this.pieces.push(new HengePiece(this,'black',[x,z]));
        this.pieces.push(new HengePiece(this,'white',[x+28,z]));
        if(x > -15){
            x = -15;
            z += 2;
        }
        else
            x += 2;
    }
    this.pieces.push(new HengePiece(this,'white',[x+30,z]));
};

/**
 * Updates the scale factor of the shader
 */
XMLscene.prototype.updateScaleFactor = function () {
	this.shader.setUniformsValues({normScale: this.tempScaleFactor});
    this.shader.setUniformsValues({R: this.tempR});
};

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function() {
    var i = 0;
    // Lights index.
   
    // Reads the lights from the scene graph.
    for (var key in this.graph.lights) {
        if (i >= 8)
            break;              // Only eight lights allowed by WebGL.

        if (this.graph.lights.hasOwnProperty(key)) {
            var light = this.graph.lights[key];
            
            this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
            this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
            this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
            this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);
            
            this.lights[i].setVisible(false);
            if (light[0])
                this.lights[i].enable();
            else
                this.lights[i].disable();
            
            this.lights[i].update();
            
            i++;
        }
    }
};

XMLscene.prototype.updateCamera = function(view){
	switch(view){
		case 'ai':
            this.finalPos = [0,15,15];
            this.moveCam = true;
            break;
        case 'black':
            this.finalPos = [-15,15,0];
            this.moveCam = true;
            break;
        case 'white':
            this.finalPos = [15,15,0];
            this.moveCam = true;
            break;
        default:
            this.finalPos = [0,15,15];
            this.moveCam = true;
            break;
	}
};

/* Handler called when the graph is finally loaded. 
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function() {
    
    this.camera.near = this.graph.near;
    this.camera.far = this.graph.far;
    this.axis = new CGFaxis(this,this.graph.referenceLength);
    
    this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1], 
    this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);
    
    this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
    
    this.initLights();

    // Adds lights group
    //this.interface.addLightsGroup(this.graph.lights);

    // Adds shaders group
    //this.interface.addShadersGroup();

    // Adds game group
    this.interface.addGameGroup();
};


/**
 * Displays the scene.
 */
XMLscene.prototype.display = function() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();
    this.pushMatrix();
    
    if (this.graph.loadedOk) 
    {        
    	this.logPicking();
		this.clearPickRegistration();
        // Applies initial transformations.
        this.multMatrix(this.graph.initialTransforms);

		// Draw axis
		//this.axis.display();

        var i = 0;
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(false);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }

        // Displays the scene.
		this.graph.displayScene();

        this.pushMatrix();
            this.translate(10,10,10);
            
        this.popMatrix();
    }
	else
	{
		// Draw axis
		//this.axis.display();
	}
    
    this.displayPickableCircles();
    this.clearPickRegistration();
   /* if(this.pieceMatrix !== null)
        this.multMatrix(this.pieceMatrix);*/
    this.displayPieces();
    this.clearPickRegistration();

    this.popMatrix();

    console.log("blackPieces" + this.Game.blackPieces);
    console.log("whitePieces" + this.Game.whitePieces);

    //teste
    if(Game.changeStatus){
        this.Game.getReplay();

        if(this.Game.lastRequest == "initGame"){
            console.log("initGame::");

            //cena manhosa para que funcione o teste
            this.Game.currPlayer = "blackPlayer";
            this.Game.getPlay();
        }
        else if(this.Game.lastRequest == "getPlay"){ 
            this.Game.play();
        }
        else if(this.Game.lastRequest == "play"){

             console.log("New board::" + this.Game.board);
             console.log("New Player::" + this.Game.currPlayer);
        }
    }


   if(this.WhitePlayer != null  && !this.isConfiguredPlayerWhite){
        this.Game.configWhitePlayer();
        this.isConfiguredPlayerWhite = true;
    }

    if(this.BlackPlayer != null  && !this.isConfiguredPlayerBlack){
        this.Game.configBlackPlayer();
        this.isConfiguredPlayerBlack = true;
    }

    
    // ---- END Background, camera and axis setup
};

XMLscene.prototype.displayPickableCircles = function() {
    this.pickableID = 0;
    let j = 0;
    for(; j < this.quadrados.length; j++){
        if(this.currentPiece !== null){
            this.registerForPick(j+1,this.quadrados[j]);
            this.redMaterial.apply();
        }
        else
            this.darkMaterial.apply();
        this.quadrados[j].display();
    }    
    this.pickableID += j+1;

};

XMLscene.prototype.displayPieces = function() {
    let w = 0;
    for(; w < this.pieces.length; w++){
        if(this.currentPiece == null)
            this.registerForPick(1+w,this.pieces[w]);
        this.pieces[w].display();
    }
};

/**
 * Update the scale factor and Red component from the given current time.
 * @param currTime
 */
XMLscene.prototype.update = function(currTime){
	for(var index in this.graph.nodes){
		this.graph.nodes[index].update(currTime);
	}

    //to seconds
    this.time = currTime/1000; 
    var delta = currTime - this.initialTime;
    
    if(this.moveCam){
        if(Math.abs(this.camera.position[0] - this.finalPos[0]) > 0.001 || Math.abs(this.camera.position[1] - this.finalPos[1]) > 0.001 || Math.abs(this.camera.position[2] - this.finalPos[2]) >=1){
            if(delta <= 10000){
                if(this.camera.position[0] < this.finalPos[0])
                    this.camera.orbit("y", delta/1000*40*DEGREE_TO_RAD);
                else
                    this.camera.orbit("y", -delta/1000*40*DEGREE_TO_RAD);
            }
        }
        else
            this.moveCam = false;
    }

    //this.paintOptions();
    this.initialTime = currTime;

    this.tempR = 0.5*(Math.sin(4*this.time));
    this.tempScaleFactor = this.tempR;
    this.updateScaleFactor();
};

XMLscene.prototype.createPickableSquares = function(){
  let x = -5.1;
  let z = -5.1;
  for(let i = 0; i < 25; i++){
  	let square = new MySquare(this, i, x,z);
  	if(x >= 5){
  		x = -5.1;
  		z += 2.55;
  	}
  	else
  		x += 2.55;
    this.quadrados.push(square);
  }


    //teste
  this.Game.startGame();
  console.log("Init GAME"); 
};

/*XMLscene.prototype.movePiece = function(finalPos){
    var p1 = [this.pieces[0].position[0],0,this.pieces[0].position[1]];
    var p2 = [this.pieces[0].position[0],10,this.pieces[0].position[1]];
    var p3 = [finalPos[0],10,finalPos[2]];
    var p4 = finalPos;
    this.pieceAnimation = new BezierAnimation(this,5,1,[p1,p2,p3,p4]);
};*/