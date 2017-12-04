%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%% POINT2D %%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%


createPoint2D(X, Y, Point):-
	Point = [X, Y].
	
getPoint2DXCoord(Point, X):-
	selectAtIndex(Point,1,X).
	
getPoint2DYCoord(Point, Y):-
	selectAtIndex(Point,2,Y).
	
setPoint2DXCoord(Point, X, ResPoint):-
	replaceAtIndex(Point, 1, X, ResPoint).
	
setPoint2DXCoord(Point, Y, ResPoint):-
	replaceAtIndex(Point, 2, Y, ResPoint).