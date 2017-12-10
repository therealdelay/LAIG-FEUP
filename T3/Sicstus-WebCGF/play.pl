%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%% PLAY %%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%

createPlay(X,Y,Type,Play):-
	createPoint2D(X,Y,Point),
	Play = [Point,Type].

getPlayPoint(Play, Point):-
	selectAtIndex(Play,1,Point).
	
getPlayXCoord(Play,X):-
	getPlayPoint(Play,Point),
	getPoint2DXCoord(Point,X).
	
getPlayYCoord(Play,Y):-
	getPlayPoint(Play,Point),
	getPoint2DYCoord(Point,Y).

getPlayType(Play,Type):-
	selectAtIndex(Play,2,Type).
	
getPlayPiece(Game,Play,Piece,GameRes):-
	getCurrentPlayer(Game,Player),
	getPlayType(Play,Type),
	ite(Player == whitePlayer,
		ite(Type == 'h',
			(Piece = 3, decWhiteHengePieces(Game,GameRes)),
			
			(Piece = 2, decWhiteRegPieces(Game,GameRes))
		),
		
		ite(Type == 'h',
			(Piece = 3, decBlackHengePieces(Game,GameRes)),
			
			(Piece = 1, decBlackRegPieces(Game,GameRes))
		)
	).
