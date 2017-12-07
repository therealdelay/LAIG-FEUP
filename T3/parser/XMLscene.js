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
	this.camTarget = [0,0,0];
	this.currentView = 'ai';
	this.lastCamTime = 0;

    this.lightValues = {};
	this.quadrados = [];
	this.blackPieces = [];
  	this.whitePieces = [];
  	this.hengePieces = [];

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
					console.log("Picked object: " + obj + ", with pick id " + customId);
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
    
    this.updateCameras();

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

	this.blackMaterial = new CGFappearance(this);
	this.blackMaterial.setAmbient(0,0,0,1);
	this.blackMaterial.setDiffuse(0,0,0,1);
	this.blackMaterial.setSpecular(0.1,0.1,0.1,0.5);
	this.blackMaterial.setShininess(0.3);

	this.darkMaterial = new CGFappearance(this);
	this.darkMaterial.setAmbient(0,0,0,1);
	this.darkMaterial.setDiffuse(0,0,0,1);
	this.darkMaterial.setSpecular(0,0,0,1);
	this.darkMaterial.setShininess(0);
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
            
            this.lights[i].setVisible(true);
            if (light[0])
                this.lights[i].enable();
            else
                this.lights[i].disable();
            
            this.lights[i].update();
            
            i++;
        }
    }
    
};

/*XMLscene.prototype.animateCamera = function (curTime, startView, endView) {
	if(Math.abs(this.lastCamTime - curTime) >= 1000){
		return;
	}
	let deltaTime = this.lastCamTime - curTime;
	let cameraAnimation = new CameraAnimation(this, startView, endView);
	while(cameraAnimation.finish != true)
		this.cam = cameraAnimation.update(deltaTime);
	this.currentView = endView;
	this.lastCamTime = curTime;
};*/

XMLscene.prototype.updateCameras = function(view){
	switch(view){
		case 'ai':
			this.cam = [1,15,15];
    		this.camTarget = [1,5,5];
    		//this.animateCamera(this.time, this.currentView, 'ai');
			break;
		case 'black':
			this.cam = [-15,15,1];
    		this.camTarget = [0,0,1];
    		//this.animateCamera(this.time, this.currentView, 'black');
			break;
		case 'white':
			this.cam = [15,15,1];
    		this.camTarget = [0,0,1];
    		//this.animateCamera(this.time, this.currentView, 'white');
			break;
		default:
			this.cam = [1,15,15];
    		this.camTarget = [1,5,5];
    		//this.animateCamera(this.time, this.currentView, 'ai');
			break;
	}
	this.camera = new CGFcamera(0.5,0.5,500,this.cam,this.camTarget);
};

/* Handler called when the graph is finally loaded. 
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function() 
{
    this.camera.near = this.graph.near;
    this.camera.far = this.graph.far;
    this.axis = new CGFaxis(this,this.graph.referenceLength);
    
    this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1], 
    this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);
    
    this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
    
    this.initLights();

    // Adds lights group
    this.interface.addLightsGroup(this.graph.lights);

    // Adds shaders group
    this.interface.addShadersGroup();
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
                    this.lights[i].setVisible(true);
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
    }
	else
	{
		// Draw axis
		this.axis.display();
	}
    
    for(let j = 0; j < this.quadrados.length; j++){
    	this.registerForPick(j+1,this.quadrados[j]);
    	this.darkMaterial.apply();
    	this.quadrados[j].display();
    }

    this.popMatrix();
    
    // ---- END Background, camera and axis setup
    
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
	


    this.tempR = 0.5*(Math.sin(4*this.time));
    this.tempScaleFactor = this.tempR;
    this.updateScaleFactor();
}

XMLscene.prototype.createPickableSquares = function(){
  let x = 2.4;
  let z = 2.4;
  for(let i = 0; i < 25; i++){
  	let square = new MySquare(this, i, x,z);
  	if(x >= 12.59){
  		x = 2.4;
  		z += 2.55;
  	}
  	else
  		x += 2.55;
  	console.log(x);
    this.quadrados.push(square);
  }
};