Game.prototype.constructor = Game;

function Game(scene) {
	this.scene = scene;

	Game.currReplay = "";
	Game.changeStatus = false;
	this.firstTime = true;
	this.lastRequest = "";

	this.board = [];
	this.blackPieces = [];
	this.whitePieces = [];
	this.currPlayer = "";

	// TODO increments it after each turn 
	this.turn = 1; 

	// TODO history of moves - add after replay of play
	this.moves = [];

	this.states = [0,1,2,3,4];
	this.currState = 0;
	this.endOfGame = false;
	this.isConf = false;
};

//initGame -> Game
Game.prototype.startGame = function() {

	//init server
	this.server = new MyServer(this);

	var sendMsg = "initGame";
	this.server.makeRequest(sendMsg);
	this.lastRequest = "initGame";
};

//getPlay(Game,Turn)
Game.prototype.getPlay = function() {

	/*if((this.scene.WhitePlayer == 'human' || this.scene.BlackPlayerPlayer == 'human')
		&& this.moves.length > 0 && this.moves[this.moves.length-1].currPlayer == this.currPlayer){
		this.lastRequest = "getPlay";
		this.currState = 2;
		Game.changeStatus = true;
	}
	else { */
	var sendMsg = "getPlay(" + this.gameInFormat().toString() + "," + this.turn.toString() + ")";
	console.log("sendMsg ::: " + sendMsg);
	this.server.makeRequest(sendMsg);
	this.lastRequest = "getPlay";
		//}
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

	if((this.lastRequest ==  "initGame" && this.firstTime) || this.lastRequest ==  "play") {
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

		if(this.lastRequest ==  "play"){
			let move = this.convertCoordsOffProlog(this.moves[this.moves.length-1].play);
			// move = [[x,y],type]
			//selecionar peça das peças disponiveis	
			//this.scene.animatePiece(move);
			this.currState = 3;
		}
		else this.firstTime = false;

	}
	else if(this.lastRequest ==  "getPlay") {
		let coords = [];
		coords.push('[[' + Game.currReplay[2] + ',' + Game.currReplay[4] + '],' + Game.currReplay[13] + ']');
		this.moves.push({ play: coords, player:this.currPlayer});
		this.currState = 2;
	}
	else if(this.lastRequest ==  "endOfGame") {
		//do something
		//se não houver vencdedor
		this.currState = 0;
		//senão this.currState = 3;
	}

	Game.changeStatus = false;
};

Game.prototype.selectPiece = function() {
	var i = 0;
	while(i < this.scene.pieces.length){

	}
}

Game.prototype.gameInFormat = function() {

	var gameJson = [], aux = [];

	for(var i = 0; i < this.board.length; i++)
		aux.push("[" + this.board[i].toString() + "]");

	gameJson.push("[" + aux.toString() + "]" );
	gameJson.push("[" + this.whitePieces.toString() + "]," + "[" + this.blackPieces.toString() + "]");
	gameJson.push(this.currPlayer); 

	return "[" + gameJson + "]";
}

Game.prototype.configWhitePlayer = function() {
	console.log("WhitePlayer 2  ::: " + this.scene.WhitePlayer);
	console.log("whitePieces ::: " + this.whitePieces);
	this.whitePieces[this.whitePieces.length-1] = this.scene.WhitePlayer;
	console.log("whitePieces 2 ::: " + this.whitePieces);
}

Game.prototype.configBlackPlayer = function() {
	console.log("BlackPlayer 2 ::: " + this.scene.BlackPlayer);
	console.log("blackPieces ::: " + this.blackPieces);
	this.blackPieces[this.blackPieces.length-1] = this.scene.BlackPlayer;
	console.log("blackPieces 2 ::: " + this.blackPieces);
}

Game.prototype.addHumanMoveToGame = function(point){
	let pointX = point[0] / 2.55 + 3;
	let pointY = point[2] / 2.55 + 3;
	let type = this.scene.currentPiece.getType();
	let newMove = [[[pointX,pointY],type]];
    this.moves.push({play: newMove, player:this.currPlayer});
}

Game.prototype.convertCoordsOffProlog = function(move) {
	var newX = (move[0][2] - 3) * 2.55;
	var newY = (move[0][4] - 3) * 2.55;

	let newMove = [];
	newMove.push('[[' + newX + ',' + newY + '],' + move[0][7] + ']');

	console.log("newMove: " + newMove);
	return newMove;
}