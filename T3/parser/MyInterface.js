 
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
MyInterface.prototype.addGameGroup = function(){

	var group = this.gui.addFolder("Menu");

    group.open();

	this.gui.add(this.scene, 'WhitePlayer', this.scene.gamePlayerOptions);
	this.gui.add(this.scene, 'BlackPlayer', this.scene.gamePlayerOptions);
};

MyInterface.prototype.processKeyDown = function(event) {
	CGFinterface.prototype.processKeyDown.call(this,event);
	switch (event.keyCode)
	{
		case (66):
		case (98):	//b
			this.scene.updateCamera('black');
			break;

		case (87):
		case (119):	//w
			this.scene.updateCamera('white');
			break;

		case (68):
		case (100):	//d
			this.scene.updateCamera('ai');
			break;
	}
};