Game.prototype.constructor = Game;

function Game(scene) {
	this.scene = scene;

	this.board = [];
	this.blackPieces = [];
	this.whitePieces = [];
	this.currPlayer = "";
};

Game.currStatus = "";

Game.changeStatus = false;

Game.prototype.startGame = function() {
	this.server = new MyServer(this);
	var sendMsg = [];
	sendMsg.push("initGame");
	this.server.makeRequest(sendMsg);
	//this.parseJsonGame();
};

Game.prototype.parseJsonGame =function() {
	var dataJson = Game.currStatus.replace(/([a-z])\w+/g, "\"$&\"");

	console.log("Game.currStatus " + Game.currStatus);

	var jsonData;
	try{
		jsonData = JSON.parse(dataJson);
	}
	catch(e){
		console.log(e);
	}
	console.log("Board:::  ");
	for(var i = 0; i < jsonData[0].length; i++ ) {
		console.log(i + ": "+ (jsonData[0][i]).toString()) ;
	}
	console.log("Pieces Human:::  " + jsonData[1]);
	console.log("Pieces Bot:::  " + jsonData[2]);
	console.log("Player:::  " + jsonData[3]); 

	this.board = jsonData[0];
	this.whitePieces = jsonData[1];
	this.blackPieces = jsonData[2];
	this.currPlayer = jsonData[3];

	Game.changeStatus = false;
};