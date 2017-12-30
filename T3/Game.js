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

	this.whitePiecesArray = [];
	this.blackPiecesArray = [];
	this.whiteScore = 0;
	this.blackScore = 0;

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
	var lastPlay = this.moves[this.moves.length-1].piece.boardPosition;
	var type = this.moves[this.moves.length-1].piece.type;
	var row = lastPlay[2] / 2.55 + 3;
	var col = lastPlay[0] / 2.55 + 3;
	var sendMsg = "play(" + this.gameInFormat() + ",[[" + col + "," + row + "]," + type + "])";
	//get last move on list of moves
	//console.log("sendMsg ::: " + sendMsg);
	this.server.makeRequest(sendMsg);
};

//endOfGame(Game) -> winner 
Game.prototype.endOfGame = function() {
	var sendMsg = "endOfGame(" + this.gameInFormat() + ")";
	this.server.makeRequest(sendMsg);
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

		if(jsonData == null)
			return;
		this.lastBoard = this.board;
		this.board = jsonData[0];
		this.whitePieces = jsonData[1];
		this.blackPieces = jsonData[2];
		this.currPlayer = jsonData[3];

		this.currState = "animationPlay";
	}
	else if(this.currState ==  "getPlay") {
		this.scene.interface.resetTimeout();
		console.log(Game.currReply);
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
		this.scene.animatePiece([newMove[0][0],newMove[0][1]]);

		this.scene.currentPiece.boardPosition = [newMove[0][0],0.3,newMove[0][1]];
				
		this.moves.push({piece: this.scene.currentPiece, turn: this.turn});
		this.currState = "applyPlay";
	
	}
	else if(this.currState ==  "verifyStatus") {
		if(Game.currReply == 'none'){
			console.log("ENTREI AQUI");
			this.turn += 1;
			this.scene.moveCam = false;
			this.currState = "getPlay";
		}
		else{
			this.currState = "endGame";
			this.winner = Game.currReply;
		}
	}
	else if(this.currState == "validPlays"){
		if((this.currPlayer == 'whitePlayer' && this.whiteType =='human') || (this.currPlayer == 'blackPlayer' && this.blackType =='human'))
			this.getAllValidSpots(Game.currReply);
		this.currState = "getPlay";
	}

	Game.currReply = "";
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

Game.prototype.configWhitePlayer = function() {
	this.whitePieces[this.whitePieces.length-1] = this.scene.WhitePlayer;
	this.whiteType = this.scene.WhitePlayer;
}

Game.prototype.configBlackPlayer = function() {
	this.blackPieces[this.blackPieces.length-1] = this.scene.BlackPlayer;
	this.blackType = this.scene.BlackPlayer;
}

Game.prototype.addHumanMoveToGame = function(pointF){
	this.scene.interface.resetTimeout();

	let pointX = pointF[0] / 2.55 + 3;
	let pointY = pointF[2] / 2.55 + 3;
	let type = this.scene.currentPiece.getType();
	let newMove = [[pointX,pointY],type];

    this.moves.push({piece: this.scene.currentPiece, turn: this.turn});
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
	for(var a = 0; a < this.scene.board.tiles.length; a++){
		this.scene.board.tiles[a].isOption = false;
	}
	for(var i = 0; i < array.length; i++){
		if(this.scene.currentPiece === null)
			break;

		for(var j = 0; j < this.scene.board.tiles.length; j++){
			if((array[i][0][0] == this.scene.board.tiles[j].pPos[0]) && (array[i][0][1] == this.scene.board.tiles[j].pPos[1]) && ((this.scene.currentPiece instanceof RegularPiece && (array[i][1] === 'n')) || (this.scene.currentPiece instanceof HengePiece && (array[i][1] === 'h')))){
				this.scene.board.tiles[j].isOption = true;
				break;
			}
		}
	}
}

Game.prototype.undoLastPlay = function() {
	this.scene.interface.resetTimeout();

	if(this.moves.length < 1)
		return;

	console.log(" ");
	console.log(" UNDO ");
	console.log("this.moves.length  " + this.moves.length);

	var lastPlay = this.moves[this.moves.length-1].piece.boardPosition;
	console.log("boardPosition " + lastPlay);
	var prevPos = this.moves[this.moves.length-1].piece.previousPosition;
	console.log("previousPosition " + prevPos);

	var initPos = this.moves[this.moves.length-1].piece.initialPosition;
	console.log("initialPosition " + initPos);



	var type = this.moves[this.moves.length-1].piece.type;
	var player = this.moves[this.moves.length-1].piece.player;
	var row = lastPlay[2] / 2.55 + 3;
	var col = lastPlay[0] / 2.55 + 3;


	//update current player
	this.currPlayer = player;

	// se o último move foi uma peça a ser jogada, volta ao sítio onde estava e a função termina
	if(!this.moves[this.moves.length-1].piece.removed){

		console.log("::: a que foi antes comida / a que comeu / outra ::: ");

		this.scene.currentPiece = this.moves[this.moves.length-1].piece;
		this.scene.invertAnimatePiece(initPos);

		console.log("vai limpar pos :::: " + (row-1) + "-" + (col-1) );
		//update board
		console.log("ANTES " + this.board);
		console.log("ANTES col-row " + (row-1) + (col-1));
		this.board[row-1][col-1] = 0;
		console.log("Depois " + this.board);

		//update pieces
		if(player == "whitePlayer"){
			if(type == 'h')
				this.whitePieces[1] = this.whitePieces[1] + 1;
			else
				this.whitePieces[0] = this.whitePieces[0] + 1;
		}
		else{
			if(type =='h')
				this.blackPieces[1] = this.blackPieces[1] + 1;
			else
				this.blackPieces[0] = this.blackPieces[0] + 1;
		}

		this.turn--; //repoe o turno
		this.scene.currentPiece.boardPosition = null;
		this.scene.currentPiece.isPlayed = false;
		this.moves.pop();
	}
	//se o último move foi uma peça a ser comida, volta onde estava e chama esta função novamente
	else{

		console.log("::: comida ::: ");

		if(this.moves[this.moves.length-1].piece.type == 'h')
			this.board[row-1][col-1]  = 3;
		else{
			if(this.moves[this.moves.length-1].piece.player == "blackPlayer")
				this.board[row-1][col-1] = 1;
			else
				this.board[row-1][col-1]  = 2;
		}

		if(player == 'blackPlayer')
			this.whiteScore--;
		else
			this.blackScore--;
		
		this.moves[this.moves.length-1].piece.removed = false;
		var tmpPiece = this.moves[this.moves.length-1].piece;
		this.moves.pop();

		this.undoLastPlay();

		this.scene.currentPiece = tmpPiece;
		this.scene.invertAnimatePiece(prevPos);
	}

	this.scene.currentPiece = null;
	this.currState = "getPlay";
}

Game.prototype.playMovesOfArray = function() {

	if(this.index < this.moves.length){

		this.scene.currentPiece = this.moves[this.index].piece;

		var lastPlay = this.scene.currentPiece.boardPosition;
		var prevPos = this.scene.currentPiece.previousPosition;
		var initPos = this.scene.currentPiece.initialPosition;
		var row = lastPlay[2] / 2.55 + 3;
		var col = lastPlay[0] / 2.55 + 3;

		this.scene.animatePiece(lastPlay);
		//this.scene.currentPiece.boardPosition = [finalPos[0][0],0.3,finalPos[0][1]];
		this.index++;
		this.currState = "animationPlay";
	}
	else{
		this.scene.mode = "game";
		this.index = 0;
	}
};

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
};


// FUNCIONA PERFEITO
Game.prototype.removePiece = function(x,z){
	var newX = (z - 3) * 2.55;
	var newZ = (x - 3) * 2.55;

	for(var i = 0; i < this.whitePiecesArray.length; i++){
		if((Math.abs(this.whitePiecesArray[i].position[0]-newX) <= 0.5) && (Math.abs(this.whitePiecesArray[i].position[2]-newZ) <= 0.5)){
			this.scene.winWhitePiece(this.whitePiecesArray[i]);
			break;
		}
	}

	if(i < 12)
		return;

	for(var i = 0; i < this.blackPiecesArray.length; i++){
		if((Math.abs(this.blackPiecesArray[i].position[0]-newX) <= 0.5) && (Math.abs(this.blackPiecesArray[i].position[2]-newZ) <= 0.5)){
			this.scene.winBlackPiece(this.blackPiecesArray[i]);
			break;
		}
	}	
}

// FUNCIONA PERFEITO
Game.prototype.checkBoardDiffs = function () {
	for(var i = 0; i < this.board.length; i++){
		for(var j = 0; j < this.board[i].length; j++){
			if(this.board[i][j] == 0){
				this.removePiece(i+1,j+1);
			}
		}
	}
}

// FUNCIONA PERFEITO
Game.prototype.selectPiece = function(type) {
	var i = 0;

	for(; i < this.whitePiecesArray.length; i++){
		if((this.whitePiecesArray[i].getType() == type) && (this.currPlayer == this.whitePiecesArray[i].player) && (!this.whitePiecesArray[i].isPlayed)){
			this.scene.currentPiece = this.whitePiecesArray[i];
			break;
		}
	}

	if(i < 12)
		return;

	i = 0;
	for(; i < this.blackPiecesArray.length; i++){
		if((this.blackPiecesArray[i].getType() == type) && (this.currPlayer == this.blackPiecesArray[i].player) && (!this.blackPiecesArray[i].isPlayed)){
			this.scene.currentPiece = this.blackPiecesArray[i];
			break;
		}
	}
}

// FUNCIONA PERFEITO
Game.prototype.createPieces = function() {
    var x = -15;
    var z = -5;
    for(var i = 0; i < 10; i++){
        this.blackPiecesArray.push(new RegularPiece(this.scene,'blackPlayer',[x,0,z]));
        this.whitePiecesArray.push(new RegularPiece(this.scene,'whitePlayer',[x+28,0,z]));
        if(x > -15){
            x = -15;
            z += 2;
        }
        else
            x += 2;
    }

    for(var j = 0; j < 2; j++){
        this.blackPiecesArray.push(new HengePiece(this.scene,'blackPlayer',[x,0,z]));
        this.whitePiecesArray.push(new HengePiece(this.scene,'whitePlayer',[x+28,0,z]));
        if(x > -15){
            x = -15;
            z += 2;
        }
        else
            x += 2;
    }
    this.whitePiecesArray.push(new HengePiece(this.scene,'whitePlayer',[x+30,0,z]));
};


// FUNCIONA PERFEITO
Game.prototype.displayPieces = function() {
	for(var w = 0; w < this.whitePiecesArray.length; w++){
		if(this.turn != 0){
			if((this.scene.currentPiece == null) && (this.whitePiecesArray[w].isPlayed == false)){
				if(this.currPlayer == 'whitePlayer')
					this.scene.registerForPick(1+w,this.whitePiecesArray[w]);
			}

			else if((this.scene.currentPiece != null) && (this.whitePiecesArray[w].selected))
				this.scene.registerForPick(1+w,this.whitePiecesArray[w]);
		}
		this.whitePiecesArray[w].display();
		this.scene.clearPickRegistration();
	}

	for(var b = 0; b < this.blackPiecesArray.length; b++){
		if(this.turn != 0){
			if((this.scene.currentPiece == null) && (this.blackPiecesArray[b].isPlayed == false)){
				if(this.currPlayer == 'blackPlayer')
					this.scene.registerForPick(1+b,this.blackPiecesArray[b]);
			}

			else if((this.scene.currentPiece != null) && (this.blackPiecesArray[b].selected))
				this.scene.registerForPick(1+b,this.blackPiecesArray[b]);
		}
		this.blackPiecesArray[b].display();
		this.scene.clearPickRegistration();
	}
};

Game.prototype.update = function (delta) {

	for(var i = 0; i < this.whitePiecesArray.length; i++){
        if (this.whitePiecesArray[i].currAnimation != null){
            if(!this.scene.pause)
                this.whitePiecesArray[i].currAnimation.getMatrix(delta);
            this.whitePiecesArray[i].updateCoords([this.whitePiecesArray[i].currAnimation.transformationMatrix[12],this.whitePiecesArray[i].currAnimation.transformationMatrix[13],this.whitePiecesArray[i].currAnimation.transformationMatrix[14]]);
        }
	}

	for(var i = 0; i < this.blackPiecesArray.length; i++){
        if (this.blackPiecesArray[i].currAnimation != null){
            if(!this.scene.pause)
                this.blackPiecesArray[i].currAnimation.getMatrix(delta);
            this.blackPiecesArray[i].updateCoords([this.blackPiecesArray[i].currAnimation.transformationMatrix[12],this.blackPiecesArray[i].currAnimation.transformationMatrix[13],this.blackPiecesArray[i].currAnimation.transformationMatrix[14]]);
        }
	}

	if((this.scene.currentPiece != null) && this.scene.currentPiece.removed && this.scene.currentPiece.currAnimation.finish)
    	this.scene.currentPiece = null;

    //console.log(this.scene.currentPiece);
};

Game.prototype.endGameNow = function(){
    var winner = this.winner;
    this.scene.interface.stopTime = true;
    this.scene.interface.addWinner();
    this.scene.resetGame();
    console.log(this);

    console.log(winner);
};

Game.prototype.display = function(){

	
	if(this.currState != this.scene.lastStatus) {

		switch(this.currState){
			case "getPlay":
				if(this.scene.currentPiece != null)
					this.getAllValidPlays();
				this.getPlay();
				this.checkBoardDiffs();
				break;
			case "applyPlay":
				this.checkBoardDiffs();
				this.play();
				this.checkBoardDiffs();
				break;
			case "verifyStatus":
				this.endOfGame();
				break;
			case "endGame":
				this.endGameNow();
			default:
				break;
		}

        this.scene.lastStatus = this.currState;
		this.getReply();
	}

	if((this.currState == "animationPlay") && this.allAnimsDone()){
            this.currState = "verifyStatus";
            this.scene.currentPiece = null;
    }
    if((this.scene.currentPiece != null) && this.scene.currentPiece.removed && this.scene.currentPiece.currAnimation.finish)
            this.scene.currentPiece = null;
};

Game.prototype.allAnimsDone = function(){
    for(var i = 0; i < this.whitePiecesArray.length; i++){
        if((this.whitePiecesArray[i].currAnimation != null) && (!this.whitePiecesArray[i].getAnimation().getStatus()))
            return false;
    }

    for(var i = 0; i < this.blackPiecesArray.length; i++){
        if((this.blackPiecesArray[i].currAnimation != null) && (!this.blackPiecesArray[i].getAnimation().getStatus()))
            return false;
    }
    return true;
};