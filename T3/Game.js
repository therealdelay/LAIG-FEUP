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
};

//getPlay(Game,Turn)
Game.prototype.getPlay = function() {
    console.log("getPlay");

	if(!((this.currPlayer == 'whitePlayer' && this.whiteType =='human') || (this.currPlayer == 'blackPlayer' && this.blackType =='human'))){ 
		var sendMsg = "getPlay(" + this.gameInFormat().toString() + "," + this.turn.toString() + ")";
		//console.log("sendMsg ::: " + sendMsg);
		this.server.makeRequest(sendMsg);
	}
};

//play(Game,Play) -> newGameState
Game.prototype.play = function() {
	console.log("play");
	var sendMsg = null;
	var lastPlay = this.moves[this.moves.length-1].pointF;
	//console.log(lastPlay);
	var sendMsg = "play(" + this.gameInFormat() + ",[[" + lastPlay[0] + "]," + lastPlay[1] + "])";
	//get last move on list of moves
	//console.log("sendMsg ::: " + sendMsg);
	this.server.makeRequest(sendMsg);
};

//endOfGame(Game) -> winner 
Game.prototype.endOfGame = function() {
	console.log("endOfGame");
	var sendMsg = "endOfGame(" + this.gameInFormat() + ")";
	////console.log("sendMsg ::: " + sendMsg);
	this.server.makeRequest(sendMsg);

	// TODO after response -> verify Winner
};


// Get server reply's
Game.prototype.getReply = function() {
	if(Game.currReply == "")
		return;

	if(this.currState == "applyPlay") {
		console.log("getReply - applyPlay");

		try{
			var jsonData = JSON.parse(Game.currReply.replace(/([a-z])\w+/g, "\"$&\""));
		}
		catch(e){
			//console.log(e);
		}

		if(jsonData == null)
			return;

		//console.log("Board:::  ");
		for(var i = 0; i < jsonData[0].length; i++ ) {
			//console.log(i + ": "+ (jsonData[0][i]).toString()) ;
		}
		//console.log("Pieces Human:::  " + jsonData[1]);
		//console.log("Pieces Bot:::  " + jsonData[2]);
		//console.log("Player:::  " + jsonData[3]);
		this.lastBoard = this.board;
		this.board = jsonData[0];
		console.log(this.lastBoard);
		console.log(this.board);
		this.whitePieces = jsonData[1];
		this.blackPieces = jsonData[2];
		this.currPlayer = jsonData[3];

		this.currState = "animationPlay";
	}
	else if(this.currState ==  "getPlay") {
		console.log("getReply - getPlay");
		let coords = [];
		var reply = Game.currReply;
		reply = reply.replace(/\|\_[0-9]*/g, '');
		coords.push(parseInt(reply[2]),parseInt(reply[4]));
		

		var move = [];
		move.push(coords);
		move.push(reply[7].charAt(0));


		//this.getAllValidPlays();
		
		var newMove = this.convertCoordsOffProlog(move);
		// move = [[x,y],type]
		//selecionar peça das peças disponiveis	
		this.selectPiece(newMove[1]);
		this.scene.animatePiece([newMove[0][0],newMove[0][1]]);
		this.scene.currentPiece.boardPosition = [newMove[0][0],0.3,newMove[0][1]];

		var pieceType = null;
		if(this.scene.currentPiece instanceof RegularPiece)
			pieceType = "n";
		else
			pieceType = "h";
		this.moves.push({ pointI: this.scene.currentPiece.position, pointF: [coords,pieceType], player:this.currPlayer, piece: pieceType});

		//console.log(this.whitePieces);
		//console.log(this.blackPieces);
		///*console.log("POINT I " + this.scene.currentPiece.position);
		//console.log("POINT F " + this.scene.currentPiece.boardPosition);*/
		this.currState = "applyPlay";
	
	}
	else if(this.currState ==  "verifyStatus") {
	console.log("getReply - verifyStatus");
		
		if(Game.currReply == 'none'){
			this.currState = "getPlay";
			this.turn += 1;
			this.scene.moveCam = false;
		}
		else
			this.currState = "endGame";
	}
	else if(this.currState == "validPlays"){
		////console.log("valid");
	console.log("getReply - validPlays");

		////console.log(Game.currReply);
		if((this.currPlayer == 'whitePlayer' && this.whiteType =='human') || (this.currPlayer == 'blackPlayer' && this.blackType =='human'))
			this.getAllValidSpots(Game.currReply);
		this.currState = "getPlay";
	}

	Game.currReply = "";
};

Game.prototype.selectPiece = function(type) {
	console.log("selectPiece");
	var i = 0;
	var found = false;
	while((i < this.scene.pieces.length) && !found) {
		if((this.scene.pieces[i].getType() == type) && ((this.currPlayer).indexOf(this.scene.pieces[i].player) !== -1) && (!this.scene.pieces[i].isPlayed)){
			this.scene.currentPiece = this.scene.pieces[i];
			found = true;
		}
		i++;
	}

	return null;
}

Game.prototype.gameInFormat = function() {
console.log("gameInFormat");
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
	console.log("addHumanMoveToGame");
	let pointX = pointF[0] / 2.55 + 3;
	let pointY = pointF[2] / 2.55 + 3;
	let type = this.scene.currentPiece.getType();
	let newMove = [[pointX,pointY],type];

    this.moves.push({pointI: this.scene.currentPiece.position, pointF: newMove, player:this.currPlayer});
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

	////console.log("newMove: " + newMove);
	return newMove;
}

Game.prototype.getAllValidPlays = function(){
 	if(!((this.currPlayer == 'whitePlayer' && this.whiteType =='human') || (this.currPlayer == 'blackPlayer' && this.blackType =='human')))
 		return;

    var sendMsg = "getAllValidPlays(" + this.gameInFormat().toString() + "," + this.turn.toString()  + ")";
    ////console.log("sendMsg ::: " + sendMsg);
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
	if(this.moves.length < 1)
		return;

	//console.log(this.moves[this.moves.length-1]);

 	let tmpMove = null;
	
	var move = this.moves[this.moves.length-1].pointF;
	tmpMove = this.convertCoordsOffProlog(move);
	//console.log(tmpMove);

	let lastMove = [tmpMove[0][0], 0.3, tmpMove[0][1]];
	let pointI = this.moves[this.moves.length-1].pointI;

	var i = 0, found = false;
	while(i < this.scene.pieces.length && !found){
		if(this.scene.pieces[i].boardPosition != null && this.scene.pieces[i].boardPosition.toString() == lastMove.toString()){
			found = true;
			this.scene.currentPiece = this.scene.pieces[i];
		}
		i++;
	}

	if(!found){
		console.warn("Error in undo move!!!");
		return;
	}

	this.scene.invertAnimatePiece(pointI);
	this.scene.currentPiece = null;
	this.moves.pop();
	this.turn--;
}