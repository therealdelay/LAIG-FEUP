/**
 * ScoreBoard class
 * @param scene
 */
function ScoreBoard(scene) {
	CGFobject.call(this,scene);
	this.scene = scene;

    this.init();
};

ScoreBoard.prototype = Object.create(CGFobject.prototype);
ScoreBoard.prototype.constructor=ScoreBoard;

/**
 * Initializes the scoreboard, creating the rectangle to display the scores
 */
ScoreBoard.prototype.init = function (){
    this.scene.getTextures();
    this.rectangle = new MyRectangle(this.scene, 0,1,1,0);
};

/**
 * Displays the scoreboard
 */
ScoreBoard.prototype.display = function (position) {
    var tex = this.getTex(this.scene.Game.whiteScore);
    this.scene.pushMatrix();
        this.scene.translate(-3.5,1,-12.1);
        this.scene.scale(6,4,4);
        this.scene.rotate(-25*DEGREE_TO_RAD,1,0,0);
        this.scene.graph.materials['defaultMaterial'].apply();
        tex.apply();
        this.rectangle.display();
    this.scene.popMatrix();

    tex = null;
    tex = this.getTex(this.scene.Game.blackScore);
    this.scene.pushMatrix();
        this.scene.translate(-9.5,1,-12.1);
        this.scene.scale(6,4,4);
        this.scene.rotate(-25*DEGREE_TO_RAD,1,0,0);
        tex.apply();
        this.rectangle.display();
    this.scene.popMatrix();

    //display time
    this.scene.pushMatrix();
        this.scene.translate(6.25,4,-13.5);
        this.scene.scale(5,1,1);
        this.scene.rotate(-25*DEGREE_TO_RAD,1,0,0);
        this.scene.gametimeTex.apply();
        this.rectangle.display();
    this.scene.popMatrix();        

    tex = null;
    tex = this.getTex((this.scene.interface.gameMin - (this.scene.interface.gameMin % 10)) / 10);
    this.scene.pushMatrix();
        this.scene.translate(6.5,3,-13);
        this.scene.rotate(-25*DEGREE_TO_RAD,1,0,0);
        tex.apply();
        this.rectangle.display();
    this.scene.popMatrix();        

    tex = null;
    tex = this.getTex(this.scene.interface.gameMin % 10);
    this.scene.pushMatrix();
        this.scene.translate(7.5,3,-13);
        this.scene.rotate(-25*DEGREE_TO_RAD,1,0,0);
        tex.apply();
        this.rectangle.display();
    this.scene.popMatrix();

    tex = null;
    tex = this.getTex((this.scene.interface.gameSec - (this.scene.interface.gameSec % 10)) / 10);
    this.scene.pushMatrix();
        this.scene.translate(9,3,-13);
        this.scene.rotate(-25*DEGREE_TO_RAD,1,0,0);
        tex.apply();
        this.rectangle.display();
    this.scene.popMatrix();

    tex = null;
    tex = this.getTex(this.scene.interface.gameSec % 10);
    this.scene.pushMatrix();
        this.scene.translate(10,3,-13);
        this.scene.rotate(-25*DEGREE_TO_RAD,1,0,0);
        tex.apply();
        this.rectangle.display();
    this.scene.popMatrix();

    //display timeout
    this.scene.pushMatrix();
        this.scene.translate(6.25,2,-12.5);
        this.scene.scale(5,1,1);
        this.scene.rotate(-25*DEGREE_TO_RAD,1,0,0);
        this.scene.timeoutTex.apply();
        this.rectangle.display();
    this.scene.popMatrix();

    tex = null;
    tex = this.getTex((this.scene.interface.timeout-(this.scene.interface.timeout % 10)) / 10);
    this.scene.pushMatrix();
        this.scene.translate(7.75,1,-12);
        this.scene.rotate(-25*DEGREE_TO_RAD,1,0,0);
        tex.apply();
        this.rectangle.display();
    this.scene.popMatrix();
    tex = null;

    tex = this.getTex(this.scene.interface.timeout % 10);
    this.scene.pushMatrix();
        this.scene.translate(8.75,1,-12);
        this.scene.rotate(-25*DEGREE_TO_RAD,1,0,0);
        tex.apply();
        this.rectangle.display();
    this.scene.popMatrix();
};

/**
 * Returns the texture related to num
 * @param num
 */
ScoreBoard.prototype.getTex = function(num) {
    switch(num){
        case 0: return this.scene.t0;
        case 1: return this.scene.t1;
        case 2: return this.scene.t2;
        case 3: return this.scene.t3;
        case 4: return this.scene.t4;
        case 5: return this.scene.t5;
        case 6: return this.scene.t6;
        case 7: return this.scene.t7;
        case 8: return this.scene.t8;
        case 9: return this.scene.t9;
    }
};