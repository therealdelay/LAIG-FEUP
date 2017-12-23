Game.prototype.constructor = Game;

function Game(scene) {
	this.scene = scene;

	//init server
	this.server = new MyServer(this);
	this.try = 10;

	Game.currReplay = "";
	this.firstTime = true;
	this.lastRequest = "";

	this.board = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
	this.blackPieces = [10,2,0,"easyBot"];
	this.whitePieces = [10,3,0,"human"];
	this.currPlayer = "whitePlayer";

	// TODO increments it after each turn 
	this.turn = 1; 

	// TODO history of moves - add after replay of play
	this.moves = [];

	this.states = ["menu","getPlay","applyPlay","animationPlay","verifyStatus","endGame"];
	this.currState = "menu";
	this.endGame = false;
	this.isConf = false;
};


Game.prototype.repeteRequest = function() {
	if(this.currState == "getPlay")
		this.getPlay();
	else if(this.currState == "play")
		this.play();
	else if(this.currState == "endGame") 
		this.endOfGame();
};

//getPlay(Game,Turn)
Game.prototype.getPlay = function() {

	/*if((this.scene.WhitePlayer == 'human' || this.scene.BlackPlayerPlayer == 'human')
		&& this.moves.length > 0 && this.moves[this.moves.length-1].currPlayer == this.currPlayer){
		this.lastRequest = "getPlay";
		this.currState = 2;
	}
	else { */
	var sendMsg = "getPlay(" + this.gameInFormat().toString() + "," + this.turn.toString() + ")";
	console.log("sendMsg ::: " + sendMsg);
	this.server.makeRequest(sendMsg);

		//}
};

//play(Game,Play) -> newGameState
Game.prototype.play = function() {

	//get last move on list of moves
	var lastPlay = this.moves[this.moves.length-1].play;
	var sendMsg = "play(" + this.gameInFormat() + "," + lastPlay.toString() + ")";
	console.log("sendMsg ::: " + sendMsg);
	this.server.makeRequest(sendMsg);

	// TODO after response -> switch currPlayer
};

//endOfGame(Game) -> winner 
Game.prototype.endOfGame = function() {
	var sendMsg = "endOfGame(" + this.gameInFormat() + ")";
	console.log("sendMsg ::: " + sendMsg);
	this.server.makeRequest(sendMsg);

	// TODO after response -> verify Winner
};


// Get server replay's
Game.prototype.getReplay = function() {

	if(Game.currReplay == ""){

		if(this.try < 10)
			this.try += 1;
		else{
			this.try = 0;
			//this.repeteRequest();
		}

		return false;
	}

	console.log(this.currState);
	console.log(Game.currReplay);

	if(this.currState == "applyPlay") {
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

		this.currState = "animationPlay";
	}
	else if(this.currState ==  "getPlay") {
		let coords = [];
		coords.push('[[' + Game.currReplay[2] + ',' + Game.currReplay[4] + '],' + Game.currReplay[13] + ']');
		this.moves.push({ play: coords, player:this.currPlayer});
		this.currState = "applyPlay";

		let move = this.convertCoordsOffProlog(this.moves[this.moves.length-1].play);
		// move = [[x,y],type]
		//selecionar peça das peças disponiveis	
		this.selectPiece(move[1]);
		this.scene.animatePiece([move[0][0],move[0][1]]);
		
	}
	else if(this.currState ==  "verifyStatus") {
		
		if(Game.currReplay == 'none'){
			this.currState = "getPlay";
			this.turn += 1;
		}
		else
			this.currState = "endGame";
	}

	Game.currReplay = "";
	return true;
};

Game.prototype.selectPiece = function(type) {
	var i = 0;
	var found = false;
	while(i < this.scene.pieces.length && !found) {
		if(this.scene.pieces[i].getType() == type && 
			(this.currPlayer).indexOf(this.scene.pieces[i].player) !== -1
			&& !this.scene.pieces[i].isPlayed){

			this.scene.currentPiece = this.scene.pieces[i];
			found = true;
		}
		i++;
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
	this.whitePieces[this.whitePieces.length-1] = this.scene.WhitePlayer;
}

Game.prototype.configBlackPlayer = function() {
	this.blackPieces[this.blackPieces.length-1] = this.scene.BlackPlayer;
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

	let newMove = [], newCoords = [];
	newCoords.push(newX);
	newCoords.push(newY);
	newMove.push(newCoords);
	newMove.push(move[0][7]);

	console.log("newMove: " + newMove);
	return newMove;
}