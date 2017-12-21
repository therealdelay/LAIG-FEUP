%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%% GETS AND SETS %%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%


%GET_SET_BOARD
getBoard(Game, Board):-
	selectAtIndex(Game, 1, Board).

setBoard(Game, Board, GameRes):-
	replaceAtIndex(Game, 1, Board, GameRes).

getBoardCell(Game, X, Y, BoardCell):-
	getBoard(Game, Board),
	selectPos(Board, X, Y, BoardCell).

setBoardCell(Game, X, Y, BoardCell, GameRes):-
	getBoard(Game, Board),
	replacePiece(Board,X, Y, BoardCell, BoardRes),
	setBoard(Game, BoardRes, GameRes).

	
%GET_SET_PLAYERS
getNextPlayer(Current, Next):-
	ite(Current == whitePlayer, Next = blackPlayer, Next = whitePlayer).
	
getOpponent(Game,Opponent):-
	getCurrentPlayer(Game,Player),
	getNextPlayer(Player,Opponent).

getCurrentPlayer(Game,CurPlayer):-
	selectAtIndex(Game, 4, CurPlayer).

setCurrentPlayer(Game, CurPlayer, GameRes):-
	replaceAtIndex(Game, 4, CurPlayer, GameRes).
	
setNextPlayer(Game, GameRes):-
	getCurrentPlayer(Game,Current),
	getNextPlayer(Current,Next),
	setCurrentPlayer(Game,Next,GameRes).
	
	
%GET_SET_WHITE_INFO
getWhiteInfo(Game, WhiteInfo):-
	selectAtIndex(Game, 2, WhiteInfo).

setWhiteInfo(Game, WhiteInfo, GameRes):-
	replaceAtIndex(Game, 2, WhiteInfo, GameRes).

	
%GET_SET_BLACK_INFO
getBlackInfo(Game, BlackInfo):-
	selectAtIndex(Game, 3, BlackInfo).

setBlackInfo(Game, BlackInfo, GameRes):-
	replaceAtIndex(Game, 3, BlackInfo, GameRes).


%GET_SET_INFO
getRegPieces(Info, RegPieces):-
	selectAtIndex(Info, 1, RegPieces).

getHengePieces(Info, HengePieces):-
	selectAtIndex(Info, 2, HengePieces).
	
getScore(Info, Score):-
	selectAtIndex(Info, 3, Score).
	
getPlayerType(Info, PlayerType):-
	selectAtIndex(Info, 4, PlayerType).
	
setRegPieces(Info, NewPieces, NewInfo):-
	replaceAtIndex(Info, 1, NewPieces, NewInfo).

setHengePieces(Info, NewPieces, NewInfo):-
	replaceAtIndex(Info, 2, NewPieces, NewInfo).
	
setScore(Info, NewScore, NewInfo):-
	replaceAtIndex(Info, 3, NewScore, NewInfo).
	
setPlayerType(Info, NewPlayerType, NewInfo):-
	replaceAtIndex(Info, 4, NewPlayerType, NewInfo).
	

%DECREASE_INCREASE_PIECES	
decRegPieces(Info, NewInfo):-
	getRegPieces(Info, Old),
	New is Old-1,
	setRegPieces(Info, New, NewInfo).

decHengePieces(Info, NewInfo):-
	getHengePieces(Info, Old),
	New is Old-1,
	setHengePieces(Info, New, NewInfo).

incScore(Info, NewInfo):-
	getScore(Info, Old),
	New is Old+1,
	setScore(Info, New, NewInfo).
	

%SET_GAME_PLAYER_TYPE
setGamePlayerType(Game,Player,NewPlayerType,GameRes):-
	getPlayerInfo(Game,Player,Info),
	setPlayerType(Info,NewPlayerType,NewInfo),
	setPlayerInfo(Game,Player,NewInfo,GameRes).

getPlayerInfo(Game,Player,Info):-
	ite(Player == whitePlayer, getWhiteInfo(Game,Info), getBlackInfo(Game,Info)).
	
setPlayerInfo(Game,Player,Info,GameRes):-
	ite(Player == whitePlayer, setWhiteInfo(Game,Info,GameRes), setBlackInfo(Game,Info,GameRes)).
	

%WHITE_INTERFACE
decWhiteRegPieces(Game, GameRes):-
	getWhiteInfo(Game,Info),
	decRegPieces(Info, NewInfo),
	setWhiteInfo(Game, NewInfo, GameRes).

decWhiteHengePieces(Game, GameRes):-
	getWhiteInfo(Game,Info),
	decHengePieces(Info, NewInfo),
	setWhiteInfo(Game, NewInfo, GameRes).
	
	

%BLACK_INTERFACE	
decBlackRegPieces(Game, GameRes):-
	getBlackInfo(Game,Info),
	decRegPieces(Info, NewInfo),
	setBlackInfo(Game, NewInfo, GameRes).
	

decBlackHengePieces(Game, GameRes):-
	getBlackInfo(Game,Info),
	decHengePieces(Info, NewInfo),
	setBlackInfo(Game, NewInfo, GameRes).