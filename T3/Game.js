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
	this.blackPieces = [10,2,0,"easyBot"];
	this.whitePieces = [10,3,0,"human"];

	this.blackType = "easyBot";
	this.whiteType = "human";

	this.currPlayer = "whitePlayer";

	// TODO increments it after each turn 
	this.turn = 1; 

	// TODO history of moves - add after reply of play
	this.moves = [];

	this.states = ["menu","getPlay","applyPlay","animationPlay","verifyStatus","endGame"];
	this.currState = "menu";
	this.endGame = false;
	this.isConf = false;
};

//getPlay(Game,Turn)
Game.prototype.getPlay = function() {

	if(!(((this.currPlayer == 'whitePlayer') && (this.whiteType =='human')) || ((this.currPlayer == 'blackPlayer') && (this.blackType =='human')))){ 
		var sendMsg = "getPlay(" + this.gameInFormat().toString() + "," + this.turn.toString() + ")";
		console.log("sendMsg ::: " + sendMsg);
		this.server.makeRequest(sendMsg);
	}
};

//play(Game,Play) -> newGameState
Game.prototype.play = function() {

	//get last move on list of moves
	var lastPlay = this.moves[this.moves.length-1].play;
	var sendMsg = "play(" + this.gameInFormat() + "," + lastPlay.toString() + ")";
	console.log("sendMsg ::: " + sendMsg);
	this.server.makeRequest(sendMsg);
};

//endOfGame(Game) -> winner 
Game.prototype.endOfGame = function() {
	var sendMsg = "endOfGame(" + this.gameInFormat() + ")";
	console.log("sendMsg ::: " + sendMsg);
	this.server.makeRequest(sendMsg);

	// TODO after response -> verify Winner
};


// Get server reply's
Game.prototype.getReply = function() {
	if(Game.currReply == "")
		return;

	if(this.currState == "applyPlay") {
		try{
			var jsonData = JSON.parse(Game.currReply.replace(/([a-z])\w+/g, "\"$&\""));
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
		
		if(Game.currReply[13] == ',')
			coords.push('[[' + Game.currReply[2] + ',' + Game.currReply[4] + '],' + Game.currReply[14] + ']');
		else
			coords.push('[[' + Game.currReply[2] + ',' + Game.currReply[4] + '],' + Game.currReply[13] + ']');	
		this.moves.push({ play: coords, player:this.currPlayer});
		this.currState = "applyPlay";
		
		let move = this.convertCoordsOffProlog(this.moves[this.moves.length-1].play);
		// move = [[x,y],type]
		//selecionar peça das peças disponiveis	
		this.selectPiece(move[1]);
		this.scene.animatePiece([move[0][0],move[0][1]]);	
	}
	else if(this.currState ==  "verifyStatus") {
		
		if(Game.currReply == 'none'){
			this.currState = "getPlay";
			this.turn += 1;
		}
		else
			this.currState = "endGame";
	}
	else if(this.currState == "validPlays"){
		console.log("valid");
		//console.log(Game.currReply);
		this.getAllValidSpots(Game.currReply);
		this.currState = "getPlay";
	}

	Game.currReply = "";
};

Game.prototype.selectPiece = function(type) {
	var i = 0;
	var found = false;
	while((i < this.scene.pieces.length) && !found) {
		if((this.scene.pieces[i].getType() == type) && ((this.currPlayer).indexOf(this.scene.pieces[i].player) !== -1) && (!this.scene.pieces[i].isPlayed)){
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
	this.whiteType = this.scene.WhitePlayer;
}

Game.prototype.configBlackPlayer = function() {
	this.blackPieces[this.blackPieces.length-1] = this.scene.BlackPlayer;
	this.blackType = this.scene.BlackPlayer;
}

Game.prototype.addHumanMoveToGame = function(point){
	let pointX = point[0] / 2.55 + 3;
	let pointY = point[2] / 2.55 + 3;
	let type = this.scene.currentPiece.getType();
	let newMove = [];

    newMove.push('[[' + pointX + ',' + pointY + '],' + type + ']');

    this.moves.push({play: newMove, player:this.currPlayer});
 
	this.currState = "applyPlay";
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

Game.prototype.getAllValidPlays = function(){
	var b = "[";
	for(var i = 0; i < this.board.length; i++){
		b += '[';
		b += this.board[i].toString();
		b += ']';
		if(i != 4)
			b += ',';
	}
	b += ']';

	var sendMsg = "getAllValidPlays([" + b + ",[" + this.whitePieces + "],[" + this.blackPieces + "]," + this.currPlayer + "]," + this.turn  + ")";
	console.log("sendMsg ::: " + sendMsg);
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
	console.log(moves);
};

Game.prototype.undoLastPlay = function() {

	if(this.moves.length < 1)
		return;
 	let tmpMove = this.convertCoordsOffProlog(this.moves[this.moves.length-1].play);
	let lastMove = [];
	lastMove.push(tmpMove[0][0]);
	lastMove.push(0.3);
	lastMove.push(tmpMove[0][1]);

	console.log("LAST MOVE " + lastMove);

	var i = 0, found = false;
	while(i < this.scene.pieces.length && !found){
		if(this.scene.pieces[i].boardPosition != null)
			console.log("piece pos " +this.scene.pieces[i].boardPosition);
		if(this.scene.pieces[i].boardPosition != null && this.scene.pieces[i].boardPosition[0] == lastMove[0]
			&& this.scene.pieces[i].boardPosition[1] == lastMove[1] 
			&& this.scene.pieces[i].boardPosition[2] == lastMove[2]){
			found = true;
		}
		i++;
	}

	if(found){
		console.log("FOUND");
		this.scene.invertAnimatePiece(this.scene.pieces[i], lastMove);
	}
	else
		console.warn("error!!!");
}