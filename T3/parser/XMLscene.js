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

    this.d = new Date();

    this.initialTime = this.d.getTime();

    this.lightValues = {};
	this.spots = [];
	this.pieces = [];
    this.pickableID = 0;
    this.currentPiece = null;

    this.piecesGraph = new PiecesGraph(this);
    this.blackPieces = [];

    this.Game = new Game(this);
    this.WhitePlayer = null;
    this.BlackPlayer = null;
    this.isConfiguredPlayerWhite = false;
    this.isConfiguredPlayerBlack = false;
    this.gamePlayerOptions = ['human', 'easyBot', 'hardBot'];

    this.cam = [0,0,0];
    this.CameraAutomatic = true;
    this.CameraView = 'ai';
    this.cameraViews = ['ai','black','white'];
    this.finalPos = [0,0,0];
    this.moveCam = false;

    this.blackSpotX = 10;
    this.blackSpotZ = 12;
    this.whiteSpotX = -2;
    this.whiteSpotZ = 12;

    this.first = 0;
    this.lastStatus = "menu";
    this.pause = false;
};

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.logPicking = function (){
	if (this.pickMode == false) {
		if ((this.pickResults != null) && (this.pickResults.length > 0)) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj){
					var customId = this.pickResults[i][1];				
					//console.log("Picked object: " + obj + ", with pick id " + customId);

                    if(this.pickResults[i][0] instanceof RegularPiece){
                        this.currentPiece = this.pieces[customId-1];
                    }
                    else if(this.pickResults[i][0] instanceof HengePiece){
                        this.currentPiece = this.pieces[customId-1];
                    }

                    if(this.currentPiece !== null){
                        if(this.pickResults[i][0] instanceof MyPickSpot){
                            var newPos = [this.pickResults[i][0].x,this.pickResults[i][0].z];
                            this.animatePiece(newPos);
                            //this.pickResults[i][0].isOption = false;
                        }
                    }
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
};

XMLscene.prototype.animatePiece = function (newPos){
    var p1 = this.currentPiece.position;
    var p2 = [this.currentPiece.position[0], 10, this.currentPiece.position[2]];
    var p3 = [newPos[0],10,newPos[1]];
    var p4 = [newPos[0],0.3,newPos[1]];

    //add to game board in prolog
    if(((this.Game.currPlayer == 'whitePlayer') && (this.Game.whiteType =='human')) || ((this.Game.currPlayer == 'blackPlayer') && (this.Game.blackType =='human'))) {
        //get human play
        this.Game.addHumanMoveToGame(p4);
    }

    this.currentPiece.currAnimation = new BezierAnimation(this, 0, 3, [p1,p2,p3,p4]);
    this.currentPiece.isPlayed = true;
    //this.currentPiece.boardPosition = [newPos[0],0.3,newPos[1]];
}

XMLscene.prototype.invertAnimatePiece = function (pointI){

    var p1 = this.currentPiece.boardPosition;
    var p2 = [this.currentPiece.boardPosition[0], 10, this.currentPiece.boardPosition[2]];
    var p3 = [pointI[0],10,pointI[2]];
    var p4 = [pointI[0],0.3,pointI[2]];

    this.currentPiece.currAnimation = new BezierAnimation(this, 0, 3, [p1,p2,p3,p4]);
    this.currentPiece.isPlayed = false;
    this.currentPiece.boardPosition = null;  
}
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
};

XMLscene.prototype.createPieces = function() {
    var x = -15;
    var z = -5;
    for(var i = 0; i < 10; i++){
        this.pieces.push(new RegularPiece(this,'black',[x,0,z]));
        this.pieces.push(new RegularPiece(this,'white',[x+28,0,z]));
        if(x > -15){
            x = -15;
            z += 2;
        }
        else
            x += 2;
    }

    for(var j = 0; j < 2; j++){
        this.pieces.push(new HengePiece(this,'black',[x,0,z]));
        this.pieces.push(new HengePiece(this,'white',[x+28,0,z]));
        if(x > -15){
            x = -15;
            z += 2;
        }
        else
            x += 2;
    }
    this.pieces.push(new HengePiece(this,'white',[x+30,0,z]));
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
    this.interface.addConfigGroup(); //so precisa de aparecer antes de iniciar o jogo
    this.interface.addCameraGroup();
    this.interface.addGameGroup(); //so precisa de aparecer depois de iniciar o jogo
    
    this.createPieces();
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
        this.displayPickableCircles();
        this.clearPickRegistration();
        this.displayPieces();
        this.clearPickRegistration();
    }
    else
    {
        // Draw axis
        //this.axis.display();
    }
    

    this.popMatrix();
    if(this.pause)
        return;

    if(this.Game.currState != this.lastStatus){

        switch(this.Game.currState){
            case "menu":
                console.log("Waiting choose players...");             
                break;
            case "getPlay":
                this.Game.getAllValidPlays();
                this.Game.getPlay();
                break;
            case "applyPlay": 
                this.Game.play();
                break;
            case "animationPlay":
                console.log("Waiting animation..."); 
                break;
            case "verifyStatus":
                this.Game.endOfGame();
                break;
            case "endGame":
                //display ganhar
                break;
            default: 
                console.warn("ERROR!!!");
        }

        this.lastStatus = this.Game.currState;
    }

    this.Game.getReply();

    if((this.Game.currState == "animationPlay") && (this.currentPiece.getAnimation().getStatus())){
        this.Game.currState = "verifyStatus";
        this.currentPiece = null;
    }
        
   if((this.WhitePlayer != null)  && (!this.isConfiguredPlayerWhite)){
        this.Game.configWhitePlayer();
        this.isConfiguredPlayerWhite = true;
    }

    if((this.BlackPlayer != null)  && (!this.isConfiguredPlayerBlack)){
        this.Game.configBlackPlayer();
        this.isConfiguredPlayerBlack = true;
    }

    if((this.isConfiguredPlayerBlack) && (this.isConfiguredPlayerWhite) && (!this.Game.isConf)){
        this.Game.isConf = true;
        this.Game.currState = "getPlay";
    }

};

XMLscene.prototype.displayPickableCircles = function() {
    this.pickableID = 0;
    let j = 0;
    for(; j < this.spots.length; j++){
        if((this.currentPiece !== null) && (this.spots[j].isOption)){
            this.registerForPick(j+1,this.spots[j]);
            this.graph.materials['redMaterial'].apply();
        }
        else
            this.graph.materials['darkMaterial'].apply();
        this.spots[j].display();
        this.clearPickRegistration();
    }    
    this.pickableID += j+1;
};

XMLscene.prototype.displayPieces = function() {
    let w = 0;
    for(; w < this.pieces.length; w++){
        if((this.currentPiece == null) && (this.pieces[w].isPlayed == false))
            this.registerForPick(1+w,this.pieces[w]);
        
        this.pieces[w].display();
        this.clearPickRegistration();
    }
};


/**
 * Update the camera position to start the animation
 * @param view
 */
XMLscene.prototype.updateCamera = function(view){
    switch(this.CameraView){
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

/**
 * Updates the camera current position, in case the camera is moving
 * @param deltaTime
 */
XMLscene.prototype.animateCamera = function(deltaTime){
    this.updateCamera();
    if(this.moveCam){
        if(Math.abs(this.camera.position[0] - this.finalPos[0]) > 0.001 || Math.abs(this.camera.position[1] - this.finalPos[1]) > 0.001 || Math.abs(this.camera.position[2] - this.finalPos[2]) >=1){
            if(deltaTime <= 10000){
                if(this.camera.position[0] < this.finalPos[0])
                    this.camera.orbit("y", deltaTime/1000*40*DEGREE_TO_RAD);
                else
                    this.camera.orbit("y", -deltaTime/1000*40*DEGREE_TO_RAD);
            }
        }
        else
            this.moveCam = false;
    }
}

/**
 * Update the scale factor and Red component from the given current time.
 * @param currTime
 */
XMLscene.prototype.update = function(currTime){
	for(var index in this.graph.nodes){
		this.graph.nodes[index].update(currTime);
	}

    this.interface.update();

    //to seconds
    this.time = currTime/1000; 
    var delta = currTime - this.initialTime;
    
    this.animateCamera(delta);

    for(var i = 0; i < this.pieces.length; i++){
        if (this.pieces[i].currAnimation != null){
            this.pieces[i].currAnimation.getMatrix(delta);
            this.pieces[i].updateCoords([this.pieces[i].currAnimation.transformationMatrix[12],this.pieces[i].currAnimation.transformationMatrix[13],this.pieces[i].currAnimation.transformationMatrix[14]]);
        }
    }

    this.initialTime = currTime;


    this.tempR = 0.5*(Math.sin(4*this.time));
    this.tempScaleFactor = this.tempR;
    this.updateScaleFactor();
};

XMLscene.prototype.createPickableSquares = function(){
  var x = -5.1;
  var z = -5.1;
  var row = 1;
  var col = 1
  for(let i = 0; i < 25; i++){
    var square = new MyPickSpot(this, i,x,z,col,row);
    this.spots.push(square);
    if(x >= 5){
        x = -5.1;
        z += 2.55;
        row++;
        col = 1;
    }
    else{
        x += 2.55;
        col++;
    }
  }
};

XMLscene.prototype.winBlackPiece = function (piece){
    this.currentPiece = piece;
    this.animatePiece([this.blackSpotX,this.blackSpotZ]);

    if(this.blackSpotZ > 12){
        this.blackSpotZ = 12;
        this.blackSpotX -= 2;
    }
    else
        this.blackSpotZ += 2;
};

XMLscene.prototype.winWhitePiece = function (piece){
    this.currentPiece = piece;
    this.animatePiece([this.whiteSpotX,this.whiteSpotZ]);

    if(this.whiteSpotZ > 12){
        this.whiteSpotZ = 12;
        this.whiteSpotX -= 2;
    }
    else
        this.whiteSpotZ += 2;
};

XMLscene.prototype.startGame = function(){
    console.log("New Game");
}

XMLscene.prototype.undoPlay = function(){
    console.log("Undo Play");
    this.Game.undoLastPlay();
}

XMLscene.prototype.pauseGame = function(){
    console.log("Pause Game");

    if(this.pause)
        this.pause = false;
    else 
        this.pause = true;
}