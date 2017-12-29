Game.prototype.constructor = Game;

function Game(scene) {
	this.scene = scene;

	//init server
	this.server = new MyServer(this);
	this.try = 10;

	Game.currReply = "";
	this.firstTime = true;
	this.lastRequest = "";

	this.board = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
	this.lastBoard = null;
	this.blackPieces = [10,2,0,"easyBot"];
	this.whitePieces = [10,3,0,"human"];

	this.blackType = "easyBot";
	this.whiteType = "human";

	this.currPlayer = "whitePlayer";

	// TODO increments it after each turn 
	this.turn = 0; 

	// TODO history of moves - add after reply of play
	this.moves = [];

	this.states = ["menu","getPlay","applyPlay","animationPlay","verifyStatus","endGame"];
	this.currState = "menu";
	this.endGame = false;
	this.isConf = false;

	this.index = 0;
};

//getPlay(Game,Turn)
Game.prototype.getPlay = function() {
	if(!((this.currPlayer == 'whitePlayer' && this.whiteType =='human') || (this.currPlayer == 'blackPlayer' && this.blackType =='human'))){ 
		var sendMsg = "getPlay(" + this.gameInFormat().toString() + "," + this.turn.toString() + ")";
		//console.log("sendMsg ::: " + sendMsg);
		this.server.makeRequest(sendMsg);
	}
};

//play(Game,Play) -> newGameState
Game.prototype.play = function() {
	var sendMsg = null;
	var lastPlay = this.moves[this.moves.length-1].pointF;
	console.log("lastPlay");
	console.log(lastPlay);
	var sendMsg = "play(" + this.gameInFormat() + ",[[" + lastPlay[0] + "]," + lastPlay[1] + "])";
	//get last move on list of moves
	//console.log("sendMsg ::: " + sendMsg);
	this.server.makeRequest(sendMsg);
};

//endOfGame(Game) -> winner 
Game.prototype.endOfGame = function() {
	var sendMsg = "endOfGame(" + this.gameInFormat() + ")";
	this.server.makeRequest(sendMsg);
};

Game.prototype.removePiece = function(x,z){
	var newX = (z - 3) * 2.55;
	var newZ = (x - 3) * 2.55;
	console.log(x);
	console.log(z);
	for(var i = 0; i < this.scene.pieces.length; i++){
		console.log(this.scene.pieces[i]);
		if((Math.abs(this.scene.pieces[i].position[0]-newX) <= 0.5) && (Math.abs(this.scene.pieces[i].position[2]-newZ) <= 0.5)){
			if(this.scene.pieces[i].player == 'blackPlayer'){
				this.scene.winBlackPiece(this.scene.pieces[i]);
				break;
			}
			else{
				this.scene.winWhitePiece(this.scene.pieces[i]);
				break;	
			}
		}
	}
}

Game.prototype.checkBoardDiffs = function () {
	for(var i = 0; i < this.board.length; i++){
		for(var j = 0; j < this.board[i].length; j++){
			if((this.lastBoard[i][j] != 0) && (this.board[i][j] == 0)){
				this.removePiece(i+1,j+1);
			}
		}
	}
}

// Get server reply's
Game.prototype.getReply = function() {
	if(Game.currReply == "")
		return;

	if(this.currState == "applyPlay") {
		try{
			var jsonData = JSON.parse(Game.currReply.replace(/([a-z])\w+/g, "\"$&\""));
		}
		catch(e){
			//console.log(e);
		}

		if(jsonData == null)
			return;
		this.lastBoard = this.board;
		this.board = jsonData[0];
		this.checkBoardDiffs();
		this.whitePieces = jsonData[1];
		this.blackPieces = jsonData[2];
		this.currPlayer = jsonData[3];

		console.log(this.moves);

		this.currState = "animationPlay";
	}
	else if(this.currState ==  "getPlay") {
		let coords = [];
		var reply = Game.currReply;
		reply = reply.replace(/\|\_[0-9]*/g, '');
		coords.push(parseInt(reply[2]),parseInt(reply[4]));
		
		var move = [];
		move.push(coords);
		move.push(reply[7].charAt(0));

		var newMove = this.convertCoordsOffProlog(move);
		// move = [[x,y],type]
		//selecionar peça das peças disponiveis	
		this.selectPiece(newMove[1]);
		this.scene.animatePiece([newMove[0][0],newMove[0][1]], false);
		this.scene.currentPiece.boardPosition = [newMove[0][0],0.3,newMove[0][1]];
		
		//this.scene.currentPiece.position = [newMove[0][0],0.3,newMove[0][1]];

		var pieceType = null;
		if(this.scene.currentPiece instanceof RegularPiece)
			pieceType = "n";
		else
			pieceType = "h";
		this.moves.push({ pointI: this.scene.currentPiece.initialPosition, pointF: [coords,pieceType], player:this.currPlayer, piece: pieceType});
		this.currState = "applyPlay";
	
	}
	else if(this.currState ==  "verifyStatus") {
		console.log(Game.currReply);
		if(Game.currReply == 'none'){
			this.currState = "getPlay";
			this.turn += 1;
			this.scene.moveCam = false;
		}
		else{
			this.currState = "endGame";
			this.winner = Game.currReply;
			console.log(this.winner);
		}
	}
	else if(this.currState == "validPlays"){
		if((this.currPlayer == 'whitePlayer' && this.whiteType =='human') || (this.currPlayer == 'blackPlayer' && this.blackType =='human'))
			this.getAllValidSpots(Game.currReply);
		this.currState = "getPlay";
	}

	Game.currReply = "";
};

Game.prototype.selectPiece = function(type) {
	var i = 0;
	var found = false;
	while((i < this.scene.pieces.length) && !found) {
		if((this.scene.pieces[i].getType() == type) && 
			((this.currPlayer).indexOf(this.scene.pieces[i].player) !== -1) && 
			(!this.scene.pieces[i].isPlayed)){
			this.scene.currentPiece = this.scene.pieces[i];
			found = true;
		}
		i++;
	}

	return null;
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
	this.whiteType = this.scene.WhitePlayer;
}

Game.prototype.configBlackPlayer = function() {
	this.blackPieces[this.blackPieces.length-1] = this.scene.BlackPlayer;
	this.blackType = this.scene.BlackPlayer;
}

Game.prototype.addHumanMoveToGame = function(pointF){
	let pointX = pointF[0] / 2.55 + 3;
	let pointY = pointF[2] / 2.55 + 3;
	let type = this.scene.currentPiece.getType();
	let newMove = [[pointX,pointY],type];
    this.moves.push({pointI: this.scene.currentPiece.initialPosition, pointF: newMove, player:this.currPlayer});
    if(!this.scene.currentPiece.eated)
    	this.scene.currentPiece.boardPosition = [pointF[0],0.3,pointF[2]];
	this.currState = "applyPlay";
}

Game.prototype.convertCoordsOffProlog = function(move) {
	////console.log(move);
	var newX = (move[0][0] - 3) * 2.55;
	var newY = (move[0][1] - 3) * 2.55;

	let newMove = [], newCoords = [];
	newCoords.push(newX);
	newCoords.push(newY);
	newMove.push(newCoords);
	newMove.push(move[1]);

	return newMove;
}

Game.prototype.getAllValidPlays = function(){
 	if(!((this.currPlayer == 'whitePlayer' && this.whiteType =='human') || (this.currPlayer == 'blackPlayer' && this.blackType =='human')))
 		return;

    var sendMsg = "getAllValidPlays(" + this.gameInFormat().toString() + "," + this.turn.toString()  + ")";
    this.server.makeRequest(sendMsg);
    this.currState = "validPlays";
};

Game.prototype.getAllValidSpots = function(array){
	array = array.replace(/\|\_[0-9]*/g, '');
	array = array.replace(/\[\[\[/g, "[[");
	array = array.replace(/\]\]/g, "]");

	var moves = [];
	for(var i = 0; i < array.length; i+=10){
		var coords = [];
		coords.push(array[i+2],array[i+4]);
		var type = array[i+7];
		var move = [coords,type];
		moves.push(move);
	}	
	this.changeColors(moves);
};

Game.prototype.changeColors = function(array){
	for(var a = 0; a < this.scene.spots.length; a++){
		this.scene.spots[a].isOption = false;
	}
	for(var i = 0; i < array.length; i++){
		if(this.scene.currentPiece === null)
			break;

		for(var j = 0; j < this.scene.spots.length; j++){
			if((array[i][0][0] == this.scene.spots[j].pPos[0]) && (array[i][0][1] == this.scene.spots[j].pPos[1]) && ((this.scene.currentPiece instanceof RegularPiece && (array[i][1] === 'n')) || (this.scene.currentPiece instanceof HengePiece && (array[i][1] === 'h')))){
				this.scene.spots[j].isOption = true;
				break;
			}
		}
	}
}

Game.prototype.undoLastPlay = function() {

	if(this.moves.length == 0)
		return;

	let tmpMove = null;
	var move = this.moves[this.moves.length-1].pointF;
	tmpMove = this.convertCoordsOffProlog(move);

	//invert animation
	let pointI = this.moves[this.moves.length-1].pointI;
	let lastMove = [pointI[0][0], 0.3, pointI[0][1]];
	
	var i = 0, found = false;
	while(i < this.scene.pieces.length && !found){
		if(	this.scene.pieces[i].initialPosition.toString() == pointI.toString()){
			found = true;
			this.scene.currentPiece = this.scene.pieces[i];
		}
		i++;
	}

	if(!found){
		console.warn("Error in undo move!!!");
		return;
	}

	if(!this.scene.currentPiece.eated){
		this.scene.invertAnimatePiece(pointI);
		//update board
		this.board[move[0][1]-1][move[0][0]-1] = 0;

		//update current player
		this.currPlayer = this.moves[this.moves.length-1].player;

		//update pieces
		if(this.moves[this.moves.length-1].player == "whitePlayer"){
			if(move[1] == 'h')
				this.whitePieces[1] = this.whitePieces[1] + 1;
			else
				this.whitePieces[0] = this.whitePieces[0] + 1;
		}
		else{
			if(move[1] =='h')
				this.blackPieces[1] = this.blackPieces[1] + 1;
			else
				this.blackPieces[0] = this.blackPieces[0] + 1;
		}
		this.turn--;
		this.scene.currentPiece.isPlayed = false;
		this.scene.currentPiece = null;
		this.moves.pop();
	}
	else{
		this.scene.invertAnimatePiece(this.scene.currentPiece.boardPosition);
		this.scene.currentPiece.eated = false;
		this.moves.pop();
		this.scene.currentPiece = null;
		this.undoLastPlay();
	}

this.currState = "getPlay";
}

Game.prototype.playMovesOfArray = function() {
	if(this.index < this.moves.length){
		let finalPos = this.convertCoordsOffProlog(this.moves[this.index].pointF);
		let finalMove = [finalPos[0][0], 0.3, finalPos[0][1]];

		if(!this.findPiece(finalMove, finalPos[1])){
			console.warn("Error in find a piece!!!");
			return;
		}

		this.scene.animatePiece([finalPos[0][0],finalPos[0][1]], false);
		this.scene.currentPiece.boardPosition = [finalPos[0][0],0.3,finalPos[0][1]];
		this.index++;
		this.currState = "animationPlay";
	}
	else{
		this.scene.mode = "game";
		this.index = 0;
		this.currState = "menu";
	}
} 

Game.prototype.findPiece = function(finalPos, type) {
	let inicialPos = this.moves[this.index].pointI;
	var i = 0;
	while((i < this.scene.pieces.length)) {
		if(inicialPos.toString() == this.scene.pieces[i].initialPosition.toString()){
			this.scene.currentPiece = this.scene.pieces[i];
			return true;
		}
		i++;
	}
	return false;
}

