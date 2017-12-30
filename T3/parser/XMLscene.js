var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
 function XMLscene(interface) {
    CGFscene.call(this);

    this.interface = interface;
    this.menuValue = true;
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
    this.camSpeed = 100;

    this.blackSpotX = 10;
    this.blackSpotZ = 12;
    this.whiteSpotX = -2;
    this.whiteSpotZ = 12;

    this.first = 0;
    this.lastStatus = "menu";
    this.pause = false;
    this.mode == "game";

    this.startThisGame = false;
};

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.switchScene = function() {
    if (this.scene == "gorogo.xml") 
      this.scene = "scene1.xml";
    else if(this.scene == "scene1.xml")
      this.scene = "scene2.xml";
    else 
    this.scene = "gorogo.xml"
    new MySceneGraph(this.scene, this);
};

XMLscene.prototype.getTextures = function (){
    this.t0 = new CGFappearance(this);
    this.t0.loadTexture("./textures/0.png");
    this.t0.setTextureWrap('CLAMP_TO_BORDER','CLAMP_TO_BORDER');

    this.t1 = new CGFappearance(this);
    this.t1.loadTexture("./textures/1.png");
    this.t1.setTextureWrap('CLAMP_TO_BORDER','CLAMP_TO_BORDER');

    this.t2 = new CGFappearance(this);
    this.t2.loadTexture("./textures/2.png");
    this.t2.setTextureWrap('CLAMP_TO_BORDER','CLAMP_TO_BORDER');

    this.t3 = new CGFappearance(this);
    this.t3.loadTexture("./textures/3.png");
    this.t3.setTextureWrap('CLAMP_TO_BORDER','CLAMP_TO_BORDER');

    this.t4 = new CGFappearance(this);
    this.t4.loadTexture("./textures/4.png");
    this.t4.setTextureWrap('CLAMP_TO_BORDER','CLAMP_TO_BORDER');

    this.t5 = new CGFappearance(this);
    this.t5.loadTexture("./textures/5.png");
    this.t5.setTextureWrap('CLAMP_TO_BORDER','CLAMP_TO_BORDER');

    this.t6 = new CGFappearance(this);
    this.t6.loadTexture("./textures/6.png");
    this.t6.setTextureWrap('CLAMP_TO_BORDER','CLAMP_TO_BORDER');

    this.t7 = new CGFappearance(this);
    this.t7.loadTexture("./textures/7.png");
    this.t7.setTextureWrap('CLAMP_TO_BORDER','CLAMP_TO_BORDER');

    this.t8 = new CGFappearance(this);
    this.t8.loadTexture("./textures/8.png");
    this.t8.setTextureWrap('CLAMP_TO_BORDER','CLAMP_TO_BORDER');

    this.t9 = new CGFappearance(this);
    this.t9.loadTexture("./textures/9.png");
    this.t9.setTextureWrap('CLAMP_TO_BORDER','CLAMP_TO_BORDER');

    this.t10 = new CGFappearance(this);
    this.t10.loadTexture("./textures/10.png");
    this.t10.setTextureWrap('CLAMP_TO_BORDER','CLAMP_TO_BORDER');
};

XMLscene.prototype.logPicking = function (){
	if (this.pickMode == false) {
		if ((this.pickResults != null) && (this.pickResults.length > 0)) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj){
					var customId = this.pickResults[i][1];	
					////console.log("Picked object: " + obj + ", with pick id " + customId);
                    if(this.pickResults[i][0] instanceof RegularPiece){
                        if(this.pickResults[i][0].player == 'whitePlayer')
                            this.currentPiece = this.Game.whitePiecesArray[customId-1];
                        else if(this.pickResults[i][0].player == 'blackPlayer')
                            this.currentPiece = this.Game.blackPiecesArray[customId-1];
                        
                        if(this.currentPiece.selected){
                            this.currentPiece.selected = false;
                            this.currentPiece = null;
                        }
                        else
                            this.currentPiece.selected = true;
                        break;
                    }
                    else if(this.pickResults[i][0] instanceof HengePiece){
                        if(this.pickResults[i][0].player == 'whitePlayer')
                            this.currentPiece = this.Game.whitePiecesArray[customId-1];
                        else if(this.pickResults[i][0].player == 'blackPlayer')
                            this.currentPiece = this.Game.blackPiecesArray[customId-1];

                        if(this.currentPiece.selected){
                            this.currentPiece.selected = false;
                            this.currentPiece = null;
                        }
                        else
                            this.currentPiece.selected = true;
                        break;
                    }
                    if(this.currentPiece !== null){
                        if(this.pickResults[i][0] instanceof MyPickSpot){
                            var newPos = [this.pickResults[i][0].x,this.pickResults[i][0].z];
                            this.animatePiece(newPos);
                        }
                    }
                }
            }
            this.pickResults.splice(0,this.pickResults.length);
        }       
    }
};

XMLscene.prototype.animatePiece = function (newPos){
    this.currentPiece.previousPosition = this.currentPiece.position;
    var p1 = this.currentPiece.position;
    var p2 = [this.currentPiece.position[0], 10, this.currentPiece.position[2]];
    var p3 = [newPos[0],10,newPos[1]];
    var p4 = [newPos[0],0.3,newPos[1]];

    //add to game board in prolog
    if((this.mode != "reviewGame") && (!this.currentPiece.removed) && ((this.Game.currPlayer == 'whitePlayer' && this.Game.whiteType =='human') || (this.Game.currPlayer == 'blackPlayer') && (this.Game.blackType =='human')))
        this.Game.addHumanMoveToGame(p4);

    this.currentPiece.currAnimation = new BezierAnimation(this, 0, 5, [p1,p2,p3,p4]);
    this.currentPiece.isPlayed = true;
    this.currentPiece.boardPosition = [newPos[0],0.3,newPos[1]];
}

XMLscene.prototype.invertAnimatePiece = function (pointI){
    var p1 = this.currentPiece.position;
    var p2 = [this.currentPiece.position[0], 10, this.currentPiece.position[2]];
    var p3 = [pointI[0],10,pointI[2]];
    var p4 = [pointI[0],pointI[1]+0.3,pointI[2]];

    this.currentPiece.currAnimation = new BezierAnimation(this, 0, 5, [p1,p2,p3,p4]);
    this.currentPiece.isPlayed = false;
}
/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
 XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);
    
    this.camera = new CGFcamera(0.35,0.5,500,[0,15,15],[0,0,0]);
        this.board = new Board(this);


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

    this.scoreBoard = new ScoreBoard(this);
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
    //this.interface.addConfigGroup(); //so precisa de aparecer antes de iniciar o jogo
    //this.interface.addGameGroup(); //so precisa de aparecer depois de iniciar o jogo
    
    //this.Game.createPieces();
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
        this.scoreBoard.display();
        this.board.display();
        this.clearPickRegistration();
        this.Game.displayPieces();
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

    if(this.mode == "reviewGame"){ 

        console.log("pimm" + this.Game.currState);
        if(this.Game.currState != this.lastStatus){
            switch(this.Game.currState){
                case "applyPlay": 
                console.log("applyPlay..."); 
                this.Game.playMovesOfArray();
                break;
                case "animationPlay":
                console.log("Waiting animation..."); 
                break;
                case "endGame":

                break;
                default: 
                console.warn("ERROR!!!");
            }

            this.lastStatus = this.Game.currState;
        }

        /*if((this.Game.currState == "animationPlay") && (this.currentPiece.getAnimation().getStatus())){
            this.Game.currState = "applyPlay";
            this.currentPiece = null;
        }*/

        return;
    }   


    this.Game.display();

    this.Game.getReply();

    if((this.isConfiguredPlayerBlack) && (this.isConfiguredPlayerWhite) && (this.Game.isConf) && (this.startThisGame)){
        this.Game.currState = "getPlay";
        this.startThisGame = false;
    }
};

XMLscene.prototype.endGame = function(){
    var winner = this.Game.winner;

    this.resetGame();
    console.log(this.Game);

    console.log(winner);
}

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



XMLscene.prototype.getCameraAngle = function() {
    var camPos = [this.camera.position[0],this.camera.position[1],this.camera.position[2]];

    vec3.normalize(camPos, camPos);
    vec3.normalize(this.finalPos,this.finalPos);
    
    var angle = null;

    let cos = vec3.dot(camPos, this.finalPos);
    if(cos > 1.0) {
        angle = 0;
    }
    else if(cos < -1.0) {
        angle = Math.PI;
    } else {
        angle = Math.acos(cos);
    }
    return angle;
};

/**
 * Updates the camera current position, in case the camera is moving
 * @param deltaTime
 */
 XMLscene.prototype.animateCamera = function(deltaTime){
    this.updateCamera();
    if(this.moveCam){
        if(Math.abs(this.camera.position[0] - this.finalPos[0]) > 0.001 || Math.abs(this.camera.position[1] - this.finalPos[1]) > 0.001 || Math.abs(this.camera.position[2] - this.finalPos[2]) >=1){
            if((deltaTime <= 10000) && (!this.pause)){
                if(this.camera.position[0] < this.finalPos[0])
                    this.camera.orbit("y", deltaTime/this.camSpeed*this.getCameraAngle()*DEGREE_TO_RAD);
                else
                    this.camera.orbit("y", -deltaTime/this.camSpeed*this.getCameraAngle()*DEGREE_TO_RAD);

                if(this.camSpeed > 10)
                    this.camSpeed-=10;
            }
        }
        else{
            this.moveCam = false;
            this.camSpeed = 100;
        }
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


    //to seconds
    this.time = currTime/1000; 
    var delta = currTime - this.initialTime;
    
    this.interface.update(delta);
    this.animateCamera(delta);

    this.Game.update(delta);

    this.initialTime = currTime;


    this.tempR = 0.5*(Math.sin(4*this.time));
    this.tempScaleFactor = this.tempR;
    this.updateScaleFactor();
};

XMLscene.prototype.winBlackPiece = function (piece){
    this.currentPiece = piece;
    this.currentPiece.removed = true;
    this.currentPiece.previousPosition = this.currentPiece.boardPosition;
    this.Game.moves.push({piece: this.currentPiece, turn: this.Game.turn});
    this.animatePiece([this.blackSpotX,this.blackSpotZ]);

    if(this.blackSpotZ > 12){
        this.blackSpotZ = 12;
        this.blackSpotX -= 2;
    }
    else
        this.blackSpotZ += 2;

    this.Game.whiteScore++;
};

XMLscene.prototype.winWhitePiece = function (piece){
    this.currentPiece = piece;
    this.currentPiece.removed = true;
    this.animatePiece([this.whiteSpotX,this.whiteSpotZ]);

    if(this.whiteSpotZ > 12){
        this.whiteSpotZ = 12;
        this.whiteSpotX -= 2;
    }
    else
        this.whiteSpotZ += 2;


    this.Game.blackScore++;
};

XMLscene.prototype.clearBoard = function(){

    for(var i=0; i < this.Game.board.length; i++){
        for(var j=0; j < this.Game.board[i].length; j++)
            this.Game.board[i][j] = 0;
    }

    for(var i=0; i < this.pieces.length; i++){
        this.currentPiece = this.pieces[i];
        this.currentPiece.isPlayed = false;
        this.invertAnimatePiece(this.pieces[i].initialPosition);
    }
    this.currentPiece = null;
};

XMLscene.prototype.startGame = function(){
    if((this.WhitePlayer != null) && (this.BlackPlayer != null)){
        this.Game.configWhitePlayer();
        this.isConfiguredPlayerWhite = true;
        this.Game.configBlackPlayer();
        this.isConfiguredPlayerBlack = true;
        this.Game.turn = 1;
        this.Game.isConf = true;
        this.lastStatus = "menu";
        this.startThisGame = true;
        this.menuValue = false;
        this.Game.currState = "getPlay";
        this.Game.createPieces();
        this.interface.stopTime = false;
    }
};

XMLscene.prototype.resetGame = function () {
    this.clearBoard();
    this.WhitePlayer = null;
    this.blackPlayer = null;
    this.isConf = false;
    this.isConfiguredPlayerBlack = false;
    this.isConfiguredPlayerWhite = false;
    this.Game.turn = 0;
}

XMLscene.prototype.undoPlay = function(){
    console.log("Undo Play");
    this.Game.undoLastPlay();
};

XMLscene.prototype.videoGame = function(){
    console.log("Video Game");

    this.clearBoard();
    this.mode = "reviewGame";
    this.Game.currState = "applyPlay";
};

XMLscene.prototype.pauseGame = function(){
    //console.log("Pause Game");

    if(this.pause)
        this.pause = false;
    else 
        this.pause = true;
};

XMLscene.prototype.newGame = function(){
    this.menuValue = true;
    this.resetGame();
};