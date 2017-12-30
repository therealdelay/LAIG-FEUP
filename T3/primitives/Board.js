function Board(scene) {
	CGFobject.call(this,scene);
	this.scene = scene;
	
    this.tiles = [];

    this.init();
};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor=Board;

Board.prototype.init = function (){
    var x = -5.1;
    var z = -5.1;
    var row = 1;
    var col = 1
    for(let i = 0; i < 25; i++){
        var tile = new MyPickSpot(this.scene,i,x,z,col,row);
        this.tiles.push(tile);
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

Board.prototype.display = function (position) {
    for(var j = 0; j < this.tiles.length; j++){
        if((this.scene.currentPiece !== null) && (this.tiles[j].isOption)){
            this.scene.registerForPick(j+1,this.tiles[j]);
            this.scene.graph.materials['redMaterial'].apply();
        }
        else
            this.scene.graph.materials['darkMaterial'].apply();
        this.tiles[j].display();
        this.scene.clearPickRegistration();
    }    
};