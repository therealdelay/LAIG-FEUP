Game.prototype.constructor = Game;

function Game(scene) {
	this.scene = scene;

	Game.currReplay = "";
	Game.changeStatus = false;
	this.lastRequest = "";

	this.board = [];
	this.blackPieces = [];
	this.whitePieces = [];
	this.currPlayer = "";

	// TODO increments it after each turn 
	this.turn = 1; 

	// TODO history of moves - add after replay of play
	this.moves = [];

	this.endOfGame = false;
};

//initGame -> Game
Game.prototype.startGame = function() {

	//init server
	this.server = new MyServer(this);

	var sendMsg = "initGame";
	this.server.makeRequest(sendMsg);
	this.lastRequest = "initGame";
};

//getPlay(Game,Turn) -> play of bot
Game.prototype.getPlay = function() {
	var sendMsg = "getPlay(" + this.gameInFormat().toString() + "," + this.turn.toString() + ")";

	console.log("sendMsg ::: " + sendMsg);

	this.server.makeRequest(sendMsg);
	this.lastRequest = "getPlay";
};

//play(Game,Play) -> newGameState
Game.prototype.play = function() {

	//get last move on list of moves
	var lastPlay = this.moves[this.moves.length-1].play;

	var sendMsg = "play(" + this.gameInFormat() + "," + lastPlay.toString() + ")";

	console.log("sendMsg ::: " + sendMsg);

	this.server.makeRequest(sendMsg);
	this.lastRequest = "play";

	// TODO after response -> switch currPlayer
};

//endOfGame(Game) -> winner 
Game.prototype.endOfGame = function() {
	var sendMsg = "endOfGame(" + this.gameInFormat() + ")";

	console.log("sendMsg ::: " + sendMsg);

	this.server.makeRequest(sendMsg);
	this.lastRequest = "endOfGame";

	// TODO after response -> verify Winner
};


// Get server replay's
Game.prototype.getReplay = function() {

	if(this.lastRequest ==  "initGame" || this.lastRequest ==  "play") {
		try{
			var jsonData = JSON.parse(Game.currReplay.replace(/([a-z])\w+/g, "\"$&\""));
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
	}
	else if(this.lastRequest ==  "getPlay") {
		this.moves.push({ play: Game.currReplay, player:this.currPlayer});
	}
	else if(this.lastRequest ==  "endOfGame") {
		//do something
	}

	Game.changeStatus = false;
};

Game.prototype.gameInFormat = function() {

	var gameJson = [], aux = [];

	for(var i = 0; i < this.board.length; i++)
		aux.push("[" + this.board[i].toString() + "]");

	gameJson.push("[" + aux.toString() + "]" );
	gameJson.push("[" + this.whitePieces.toString() + "]," + "[" + this.blackPieces.toString() + "]");
	gameJson.push(this.currPlayer); 

	return "[" + gameJson + "]";
}