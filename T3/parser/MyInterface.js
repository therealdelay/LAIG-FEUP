 
 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor 
    CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;


/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui
    
    this.gui = new dat.GUI();

    this.gui.add(this.scene,'switchScene').name("Switch Scene");
  	this.config = this.gui.addFolder('Configurations');
  	this.addConfigGroup(); 
    this.menu = this.gui.addFolder('Menu');
    this.addGameGroup(); 
  
    this.noViews = true;
    this.noConfigs = true;
    this.stopTime = true;


    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights) {
	
    var group = this.gui.addFolder("Lights");
    group.open();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            group.add(this.scene.lightValues, key);
        }
    }
};

MyInterface.prototype.removeFolder = function(name){
	var folder = this.gui.__folders[name];
	if (!folder) {
	    return;
	}
	folder.close();
	this.gui.__ul.removeChild(folder.domElement.parentNode);
	delete this.gui.__folders[name];
}

MyInterface.prototype.addCameraViews = function(){
	
	var group = this.gui.addFolder("Camera");

	group.open();
	group.add(this.scene, 'CameraView', this.scene.cameraViews);
	this.noViews = false;
}

/**
 * Adds a group for shaders and add nodes selectable
 */
MyInterface.prototype.addShadersGroup = function(){

	var group = this.gui.addFolder("Shaders");

    group.open();

	this.gui.add(this.scene, 'currentNode', this.scene.nodesToShade);

	this.gui.add(this.scene, 'selectable');	
};

/**
 * Adds a group for shaders and add nodes selectable
 */
MyInterface.prototype.addConfigGroup = function(){

    this.config.open();
	this.config.add(this.scene, 'WhitePlayer', this.scene.gamePlayerOptions).name("White Player");
	this.config.add(this.scene, 'BlackPlayer', this.scene.gamePlayerOptions).name("Black Player");
	this.config.add(this.scene, 'startGame').name("Start Game");
};

MyInterface.prototype.addGameGroup = function(){

/*
var palette = {
  color1: '#FF0000', // CSS string
  color2: [ 0, 128, 255 ], // RGB array
  color3: [ 0, 128, 255, 0.3 ], // RGB with alpha
  color4: { h: 350, s: 0.9, v: 0.3 } // Hue, saturation, value
};
this.gui.addColor(palette, 'Background Color');*/
	this.timeout = 5;
	this.timeCounter = 0;
    this.menu.open();
    this.menu.add(this, 'timeout');
    this.menu.add(this.scene, 'newGame').name("New Game");
	this.menu.add(this.scene, 'pauseGame').name("Pause Game");
	this.menu.add(this.scene, 'undoPlay').name("Undo Play");
	this.menu.add(this.scene, 'videoGame').name("Review Game");
	this.menu.add(this.scene, 'CameraAutomatic').name("Automatic Camera");
};

MyInterface.prototype.resetTimeout = function(){
	this.timeout = 30;
};

MyInterface.prototype.triggerTimeout = function(){
	this.stopTime = true;
	this.scene.Game.winner = (this.scene.Game.currPlayer == 'blackPlayer') ? 'whitePlayer' : 'blackPlayer';
	this.scene.Game.endGameNow();
}

MyInterface.prototype.addWinner = function (){
	var folder = this.gui.addFolder("WINNER");
	folder.open();
	folder.add(this.scene.Game, 'winner').name("");
}

MyInterface.prototype.switchVisibility = function(value){
	if(!value){
		this.menu.close();
		this.config.open();
	}
    else {
        this.menu.open();
        this.config.close();
    }
}

MyInterface.prototype.processKeyDown = function(event) {
	CGFinterface.prototype.processKeyDown.call(this,event);
	if(!this.scene.CameraAutomatic)
		return;
	switch (event.keyCode)
	{
		case (66):
		case (98):	//b
			this.scene.CameraView = 'black';
			break;

		case (87):
		case (119):	//w
			this.scene.CameraView = 'white';
			break;

		case (68):
		case (100):	//d
			this.scene.CameraView = 'ai';
			break;
	}

};

MyInterface.prototype.update = function(deltaTime){
	if(!this.stopTime){
		if(!isNaN(deltaTime))
			this.timeCounter = this.timeCounter + deltaTime/15;
		if(this.timeCounter > 60){
			this.timeCounter = 0;
			this.timeout--;
		}
		if(this.timeout == 0)
			this.triggerTimeout();
	}

	if(this.scene.CameraAutomatic){
		this.removeFolder("Camera");
		this.noViews = false;
	}
	else if(!this.scene.CameraAutomatic && !this.noViews){
		this.addCameraViews();
		this.noViews = true;
	}

	if(this.scene.menuValue){
		this.scene.CameraView = 'ai';
		if(this.noConfigs){
			this.switchVisibility(false);
			this.removeFolder("WINNER");
			//this.addConfigGroup();
			this.noConfigs = false;
		}
		return;
	}
	else{
		//this.removeFolder("Configurations");
		this.switchVisibility(true);
		this.noConfigs = true;
	}

	if(((this.scene.Game.currPlayer == 'whitePlayer' && this.scene.Game.whiteType =='human')) && ((this.scene.Game.turn % 2) == 1)){
		this.scene.CameraView = 'white';
		return;
	}
	else if(((this.scene.Game.currPlayer == 'blackPlayer' && this.scene.Game.blackType =='human')) && ((this.scene.Game.turn % 2) == 0)){
		this.scene.CameraView = 'black';
		return;
	}
	else if((this.scene.Game.currPlayer == 'whitePlayer' && this.scene.Game.whiteType =='easyBot') || (this.scene.Game.currPlayer == 'whitePlayer' && this.scene.Game.whiteType =='hardBot') || (this.scene.Game.currPlayer == 'blackPlayer' && this.scene.Game.blackType =='easyBot') || (this.scene.Game.currPlayer == 'blackPlayer' && this.scene.Game.blackType =='hardBot'))
		this.scene.CameraView = 'ai';
}