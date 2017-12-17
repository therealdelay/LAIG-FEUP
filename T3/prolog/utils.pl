%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%% UTILS %%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%

%CONVERTS the list symbol to the board symbol
convert(0,' ').
convert(1,'B').
convert(2,'W').
convert(3,'H').
convert(-1,'N').

%IF_THEN_ELSE
ite(If,Then,_):- If, !, Then.
ite(_,_,Else):- Else.

%SELECT_AT_INDEX
selectAtIndex(List, Index, Elem):-
	nth1(Index, List, Elem).

%SELECT_POS
selectPos(State,X,Y,Elem):- 
	nth1(Y,State,Row), 
	nth1(X,Row,Elem).

%REPLACE_AT_INDEX
replaceAtIndex(Src, Index, NewVal, Res) :-
   replaceAtIndex0(Src, 1, Index, NewVal, Res).

replaceAtIndex0([_|Es], I , I, X, [X|Es]).
replaceAtIndex0([E|Es], I0, I, X, [E|Xs]) :-
   I1 is I0+1,
   replaceAtIndex0(Es, I1,I, X, Xs).
   
%REPLACE_PIECE ON BOARD
replacePiece(State,X,Y,NewElem,Res):-
	replacePiece_index_column(State,X,1,Y,NewElem,Res).
	
replacePiece_index_column([H|Es],X,Y,Y,NewElem,[NewRow|Es]):- 
	replaceAtIndex(H, X, NewElem, NewRow).
	
replacePiece_index_column([E|Es], X, Y0, Y, NewElem, [E|Xs]):-
	Y1 is Y0+1,
	replacePiece_index_column(Es,X,Y1,Y,NewElem, Xs).

%CLEAR_SCREEN	
clearScreen:-
	write('\33\[2J').

%CONVERT_ASCII_CODE_TO_NUMBER
codeToNumber(Code,Value):-
	Value is Code-48 .

%READ_STRING
readString([Char|OtherChars]):-
	get_code(Char),
	ite(Char = 10, (OtherChars = [],true), readString(OtherChars)).

%READ_PLAY_COORDENATES	
readPlayCoords(X,Y):-
	readString(String),
	proper_length(String,Length),
	Length = 4,
	selectAtIndex(String,2,SeparatorCode),
	SeparatorCode = 45,
	selectAtIndex(String,1,XCode),
	selectAtIndex(String,3,YCode),
	codeToNumber(XCode,X),
	codeToNumber(YCode,Y).
	
readPlayCoords(_,_):-
	write('Invalid input'), nl, nl, fail.
	
%READ_PLAY_PIECE_TYPE
readPlayPieceType(Type):-
	readString(String),
	selectAtIndex(String,1,TypeCode),
	char_code(Type,TypeCode).
	
%READ_MENU_OPTION
readOption(Option):-
	readString(String),
	selectAtIndex(String,1,OptionCode),
	codeToNumber(OptionCode,Option).

%READ_PLAY	
readInput(X,Y,Type):- 
	repeat,
		write('Coords (X-Y): '), 
		readPlayCoords(X,Y),
		write('Type (n or h): '),
		readPlayPieceType(Type).
		

readPlay(Play):-
	repeat,
		readInput(X,Y,Type),
		createPlay(X,Y,Type,Play).
		

%PRINT_BOARD
p_u:- write('  ___ ___ ___ ___ ___ '), nl.
p_s:- write(' |___|___|___|___|___|'), nl.
p_m([],_).
p_m([L|T],C):- write(C), C1 is C+1, p_l(L), p_m(T,C1).
p_l([C|[]]):- convert(C,S),write('| '), write(S), write(' |'), nl, p_s.
p_l([C|T]):- convert(C,S),write('| '), write(S), write(' '), p_l(T).
p_x:-
	write('  ******************'),nl,
	write('  ******GoRoGo******'),nl,
 	write('   1   2   3   4   5'), nl.
p_g:-
	write('  ******GoRoGo******'),nl,
	write('  ******************'),nl.
printBoard(Board):- p_x, p_u, p_m(Board,1), p_g.


%PRINT_PLAYERS_INFO
printPlayerInfo(Player,Info,Current):-
	getRegPieces(Info,RegPieces),
	getHengePieces(Info,HengePieces),
	getScore(Info,Score),
	format('~s: ~d(R) - ~d(H) - ~d(S)', [Player,RegPieces,HengePieces,Score]),
	ite(Current == 'true', write('       (C)'),true).

printPlayersInfo(Game):-
	getWhiteInfo(Game,WhiteInfo),
	getBlackInfo(Game,BlackInfo),
	getCurrentPlayer(Game,Player),
	ite(Player == whitePlayer, 
		(CurrWhite = 'true', CurrBlack = 'false'), 
		( CurrWhite = 'false', CurrBlack = 'true')),
	printPlayerInfo("WHITE",WhiteInfo,CurrWhite), nl,
	printPlayerInfo("BLACK",BlackInfo,CurrBlack), nl.
	
	
%PRINT_WINNER
printWinner(Player):-
	ite(Player == whitePlayer, Winner = "WHITE", Winner = "BLACK"),
	format('CONGRATULATIONS: ~s WON',[Winner]).
	
%PRINT_GAME
printGame(Game):-
	getBoard(Game,Board),
	clearScreen,
	printBoard(Board), nl,
	printPlayersInfo(Game), nl.
	
%WAIT_FOR_ENTER	
waitForEnter:-
	readString(_).
	
%PRINT_PLAYER_TYPE
printPlayerType(human):- write(' HUMAN  ').
printPlayerType(easyBot):- write('BOT EASY').
printPlayerType(hardBot):- write('BOT HARD').
	
printPlayersType(Game):-
	getPlayerInfo(Game,whitePlayer,WhiteInfo),
	getPlayerType(WhiteInfo,WhitePlayer),
	getPlayerInfo(Game,blackPlayer,BlackInfo),
	getPlayerType(BlackInfo, BlackPlayer),
	write('*   '), printPlayerType(WhitePlayer), write('        '), printPlayerType(BlackPlayer), write('   *'),nl.
