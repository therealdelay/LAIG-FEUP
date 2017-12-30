function ScoreBoard(scene) {
	CGFobject.call(this,scene);
	this.scene = scene;

    this.init();
};

ScoreBoard.prototype = Object.create(CGFobject.prototype);
ScoreBoard.prototype.constructor=ScoreBoard;

ScoreBoard.prototype.init = function (){
    this.scene.getTextures();
    this.rectangle = new MyRectangle(this.scene, 0,1,1,0);
};

ScoreBoard.prototype.display = function (position) {
    var tex = this.getWhiteScoreTex();
    this.scene.pushMatrix();
        this.scene.translate(0,1,-12.1);
        this.scene.scale(6,4,4);
        this.scene.rotate(-25*DEGREE_TO_RAD,1,0,0);
        this.scene.graph.materials['defaultMaterial'].apply();
        //tex.apply();
        this.rectangle.display();
    this.scene.popMatrix();

    tex = null;
    tex = this.getBlackScoreTex();
    this.scene.pushMatrix();
        this.scene.translate(-6,1,-12.1);
        this.scene.scale(6,4,4);
        this.scene.rotate(-25*DEGREE_TO_RAD,1,0,0);
        //tex.apply();
        this.rectangle.display();
    this.scene.popMatrix();
};

ScoreBoard.prototype.getWhiteScoreTex = function() {
    switch(this.scene.Game.whiteScore){
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
        case 10: return this.scene.t10;
    }
};

ScoreBoard.prototype.getBlackScoreTex = function() {
    switch(this.scene.Game.blackScore){
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
        case 10: return this.scene.t10;
    }
};