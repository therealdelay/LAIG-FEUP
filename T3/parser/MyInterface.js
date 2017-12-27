 
 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor 
    CGFinterface.call(this);
}
;

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

    this.noViews = true;

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

	var group = this.gui.addFolder("Configurations");
    group.open();


	group.add(this.scene, 'WhitePlayer', this.scene.gamePlayerOptions).name("White Player");
	group.add(this.scene, 'BlackPlayer', this.scene.gamePlayerOptions).name("Black Player");

	group.add(this.scene, 'startGame').name("Start Game");
};

MyInterface.prototype.addGameGroup = function(){
	var group = this.gui.addFolder("Menu");
    group.open();

	group.add(this.scene, 'pauseGame').name("Pause Game");
	group.add(this.scene, 'undoPlay').name("Undo Play");
	group.add(this.scene, 'videoGame').name("Review Game");
	group.add(this.scene, 'CameraAutomatic').name("Automatic Camera");

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

MyInterface.prototype.update = function(){
	if(this.scene.CameraAutomatic){
		this.removeFolder("Camera");
		this.noViews = false;
	}
	else if(!this.scene.CameraAutomatic && !this.noViews){
		this.addCameraViews();
		this.noViews = true;
	}

	if(this.scene.Game.turn == 0){
		this.scene.CameraView = 'ai';
		return;
	}

	if((this.scene.Game.currPlayer == 'whitePlayer' && this.scene.Game.whiteType =='human') || (this.scene.Game.currPlayer == 'blackPlayer' && this.scene.Game.blackType =='human')){ 
		if((this.scene.Game.turn % 2) == 1)
			this.scene.CameraView = 'white';
		else
			this.scene.CameraView = 'black';
	}
	else
		this.scene.CameraView = 'ai';
}