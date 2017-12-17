:-use_module(library(lists)).
:-use_module(library(random)).
:-include('utils.pl').
:-include('getsandsets.pl').
:-include('menu.pl').
:-include('point2d.pl').
:-include('ai.pl').
:-include('play.pl').

initialBoard([[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]).

player(human).
player(easyBot).
player(hardBot).

playType(n).
playType(h).
 	
playerPiece(blackPlayer,1).
playerPiece(whitePlayer,2).

%CHECK_IF_SURROUNDED
compPiece(Curr,_,t):- Curr == 3.
compPiece(Curr,_,_):- Curr == -1.
compPiece(Curr,Opponent,_):- Curr == Opponent.

surrounded(_,6,Y,_,_,_) :- Y \= 6.
surrounded(_,0,Y,_,_,_) :- Y \= 0.
surrounded(_,X,6,_,_,_) :- X \= 6.
surrounded(_,X,0,_,_,_) :- X \= 0.

surrounded(State,X,Y,_,Opponent,Henge):- 
	selectPos(State,X,Y,Elem),
	playerPiece(Opponent,OpponentPiece),
	compPiece(Elem,OpponentPiece,Henge).
	
surrounded(State,X,Y,_,_,_):-
	selectPos(State,X,Y,Elem),
	Elem == 0, !, fail.
	
surrounded(State,X,Y,Player,Opponent,Henge):-
	replacePiece(State,X,Y,-1,TmpState),
	LeftX is X-1,
	RightX is X+1,
	DownY is Y-1,
	UpY is Y+1,
	surrounded(TmpState,LeftX,Y,Player,Opponent,Henge), !,
	surrounded(TmpState,RightX,Y,Player,Opponent,Henge), !,
	surrounded(TmpState,X,DownY,Player,Opponent,Henge), !,
	surrounded(TmpState,X,UpY,Player,Opponent,Henge), !.
	
isSurroundedOpponent(Game,Point,Henge):-
	getBoard(Game,Board),
	getCurrentPlayer(Game,Player),
	getNextPlayer(Player,Opponent),
	getPoint2DXCoord(Point,X),
	getPoint2DYCoord(Point,Y),
	selectPos(Board,X,Y,Elem),
	playerPiece(Opponent,OpponentPiece),
	Elem == OpponentPiece,
	surrounded(Board,X,Y,Opponent,Player,Henge).
	
isSurroundedPlayer(Game,Point,Henge):-
	getBoard(Game,Board),
	getCurrentPlayer(Game,Player),
	getNextPlayer(Player,Opponent),
	getPoint2DXCoord(Point,X),
	getPoint2DYCoord(Point,Y),
	selectPos(Board,X,Y,Elem),
	playerPiece(Player,PlayerPiece),
	Elem == PlayerPiece,
	surrounded(Board,X,Y,Player,Opponent,Henge).
	

%----------------VALID_PLAY---------------

checkInBoard(Play):-
	getPlayXCoord(Play,X),
	getPlayYCoord(Play,Y),
	X > 0, X < 6,
	Y > 0, Y < 6.
	
checkEmptyCell(Game,Play):-
	getPlayXCoord(Play,X),
	getPlayYCoord(Play,Y),
	getBoardCell(Game,X,Y,Cell),
	Cell == 0.

checkRegPieceStock(Game):-
	getCurrentPlayer(Game,Player),
	getPlayerInfo(Game,Player,Info),
	getRegPieces(Info,Pieces),
	Pieces > 0.
	
checkHengePieceStock(Game):-
	getCurrentPlayer(Game,Player),
	getPlayerInfo(Game,Player,Info),
	getHengePieces(Info,Pieces),
	Pieces > 0.
	
checkPieceStock(Game,Play):-
	getPlayType(Play,Type),
	ite(Type == 'h',
		checkHengePieceStock(Game),
		
		checkRegPieceStock(Game)
	
	).

checkPosSurroundedWithoutHenges(Game,Play):-
	getPlayPoint(Play,Point),
	isSurroundedPlayer(Game,Point,f).
	
checkSameScoreAfterPlay(Game):-
	getCurrentPlayer(Game,Player),
	getPlayerInfo(Game,Player,PreviousInfo),
	getScore(PreviousInfo,PreviousScore),
	updateGame(Game,GameRes),
	getPlayerInfo(GameRes,Player,FutureInfo),
	getScore(FutureInfo,FutureScore),
	PreviousScore == FutureScore.
	
checkInvalidPosRequirements(Game,Play):-
	checkPosSurroundedWithoutHenges(Game,Play),
	checkSameScoreAfterPlay(Game).

checkValidPos(Game,Play):-
	getPlayType(Play,Type),
	ite(Type == 'h',	
		true,
		
		(	
			applyPlay(Game,Play,GameRes),
			ite(checkInvalidPosRequirements(GameRes,Play),fail,true)
		)
	).
	
	
checkValidType(Play,Turn):-
	getPlayType(Play,Type),
	Turn > 1,
	Type = 'n'.
	
checkValidType(Play,_):-
	getPlayType(Play,Type),
	Type = 'h'.

validPlay(Game,Play,Turn):-
	checkValidType(Play,Turn),
	checkEmptyCell(Game,Play),
	checkPieceStock(Game,Play),
	checkInBoard(Play),
	checkValidPos(Game,Play).

	
	
%--------------PLAYS----------------

getUserPlay(Game,Play,Turn):-
	repeat,
		readPlay(Play),
		validPlay(Game,Play,Turn).

	

getPlay(Game,Play,Turn):-
	getCurrentPlayer(Game,Player),
	getPlayerInfo(Game,Player,Info),
	getPlayerType(Info,PlayerType),
	ite(PlayerType == human, getUserPlay(Game,Play,Turn), true),
	ite(PlayerType == easyBot, getEasyBotPlay(Game,Play,Turn), true),
	ite(PlayerType == hardBot, getHardBotPlay(Game,Play,Turn), true).
	
applyPlay(Game,Play,GameRes):-
	getPlayXCoord(Play,X),
	getPlayYCoord(Play,Y),
	getPlayPiece(Game,Play,Piece,GameTmp),
	setBoardCell(GameTmp,X,Y,Piece,GameRes).
	
	
	
	
%-------------END_OF_GAME--------------

checkInvalidMovesLeft(Game,Winner):-
	getCurrentPlayer(Game,Player),
	getPlayerInfo(Game,Player,Info),
	getRegPieces(Info,RegPieces),
	getHengePieces(Info,HengePieces),
	ite((RegPieces == 0,HengePieces > 0),
		getNextPlayer(Player,Winner),
		
		fail
	).
	

checkPiecesLeft(Game,Winner):-
	getPlayerInfo(Game,whitePlayer,WhiteInfo),
	getPlayerInfo(Game,blackPlayer,BlackInfo),
	getRegPieces(BlackInfo,BRegPieces),
	getHengePieces(BlackInfo,BHengePieces),
	getScore(BlackInfo,BScore),
	getRegPieces(WhiteInfo,WRegPieces),
	getHengePieces(WhiteInfo,WHengePieces),
	getScore(WhiteInfo,WScore),
	ite(
		(BRegPieces == 0, BHengePieces == 0, WRegPieces == 0, WHengePieces == 0),
		
			ite(WScore >= BScore, Winner = whitePlayer, Winner = blackPlayer),
			
			fail
	).
	

endOfGame(Game,Winner):-
	checkInvalidMovesLeft(Game,Winner).

	
endOfGame(Game,Winner):-
	checkPiecesLeft(Game,Winner).

endOfGame(_,none).


%------------UPDATE_GAME-----------------

clearBoard(Game,[],Game).

clearBoard(Game, [Point|T], GameRes):-
	getPoint2DXCoord(Point,X),
	getPoint2DYCoord(Point,Y),
	setBoardCell(Game,X,Y,0,GameTmp1),
	getCurrentPlayer(Game,Player),
	getPlayerInfo(GameTmp1,Player,Info),
	incScore(Info,InfoRes),
	setPlayerInfo(GameTmp1,Player,InfoRes,GameTmp2),
	clearBoard(GameTmp2,T,GameRes).
	
	
updateGame(Game,GameRes):-
	findall(Point, isSurroundedOpponent(Game,Point,t), Points),
	clearBoard(Game,Points,GameRes).
	
	
waitForBot(Game):-
	getCurrentPlayer(Game,Player),
	getPlayerInfo(Game,Player,Info),
	getPlayerType(Info,PlayerType),
	ite((PlayerType == easyBot ; PlayerType == hardBot),(write('  Press Enter to continue'),nl,waitForEnter),true).
	
updateGameCycle(Game,GameRes):-
	updateGame(Game,GameTmp1),
	setNextPlayer(GameTmp1,GameTmp2),
	updateGame(GameTmp2,GameRes).
	
play(Game):-
	playCycle(Game,Winner,1),
	printWinner(Winner), !,
	waitForEnter, !,
	gorogo.

playCycle(Game,Winner,_):-
	endOfGame(Game,Winner),
	printGame(Game).
	
playCycle(Game,Winner,Turn):-
	printGame(Game),
	waitForBot(Game),
	getPlay(Game,Play,Turn),
	applyPlay(Game,Play,GameTmp1),
	updateGameCycle(GameTmp1,GameTmp2),
	NextTurn is Turn+1,
	playCycle(GameTmp2,Winner,NextTurn).


initGamePvP(Game):-
	initialBoard(Board),
	WhiteInfo = [10,3,0,human],
	BlackInfo = [10,2,0,easyBot],
	Player = whitePlayer,
	Game = [Board, WhiteInfo, BlackInfo, Player].