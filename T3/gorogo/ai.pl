%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%% AI %%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%

%GET_EASY_BOT_PLAY
getRandomPlay(Plays,ResPlay):-
	random_member(ResPlay,Plays).
	
getEasyBotPlay(Game,ResPlay,Turn):-
	findall(Play,validPlay(Game,Play,Turn),Plays),
	%write(Plays), nl,
	getRandomPlay(Plays,ResPlay).


%EVALUATE_PLAY
evaluateScoreDiff(PreviousGame, FutureGame, Value):-
	getCurrentPlayer(PreviousGame,Player),
	getPlayerInfo(PreviousGame,Player,PrevInfoPlayer),
	getScore(PrevInfoPlayer,PrevScorePlayer),
	getPlayerInfo(FutureGame,Player,FutureInfoPlayer),
	getScore(FutureInfoPlayer,FutureScorePlayer),
	Gains is FutureScorePlayer-PrevScorePlayer, 
	
	getNextPlayer(Player,Opponent),
	getPlayerInfo(PreviousGame,Opponent,PrevInfoOpponent),
	getScore(PrevInfoOpponent,PrevScoreOpponent),
	getPlayerInfo(FutureGame,Opponent,FutureInfoOpponent),
	getScore(FutureInfoOpponent,FutureScoreOpponent),
	Losses is FutureScoreOpponent-PrevScoreOpponent,
	
	Value is ((Gains-Losses)+10)/20.
	
evaluatePlayPosition(Play,_,_,0):-
	getPlayXCoord(Play,X),
	getPlayYCoord(Play,Y),
	((X == 1, Y == 1) ; (X == 5, Y == 1) ; (X == 1, Y == 5) ; (X == 5, Y == 5)).
	
evaluatePlayPosition(Play,_,_,0.025):-
	getPlayXCoord(Play,X),
	getPlayYCoord(Play,Y),
	(X == 1 ; X == 5; Y == 1 ; Y == 5).
	
evaluatePlayPosition(_,_,_,0.05).

evaluatePlay(Play,PreviousGame,FutureGame,Value):-
	evaluateScoreDiff(PreviousGame,FutureGame,Value1),
	evaluatePlayPosition(Play,_,_,Value2),
	
	Value is (0.95 * Value1 + Value2).

	
%GET_HARD_BOT_PLAY
getGameAfterPlay(Game,Play,GameRes):-
	applyPlay(Game,Play,GameTmp1),
	updateGameCycle(GameTmp1,GameRes).

getPlayValues(_,[],[]).
	
getPlayValues(Game,[Play|OtherPlays],[Value|OtherValues]):-
	getGameAfterPlay(Game,Play,FutureGame),
	evaluatePlay(Play,Game,FutureGame,Value),
	getPlayValues(Game,OtherPlays,OtherValues).
	
	
selectBestPlays([],[],_,[]).

selectBestPlays([Play|OtherPlays],[Value|OtherValues],BestValue,[Play|OtherBestPlays]):- 	
	Value == BestValue, !, 
	selectBestPlays(OtherPlays,OtherValues,BestValue,OtherBestPlays).

selectBestPlays([_|OtherPlays],[_|OtherValues],BestValue, BestPlays):- 
	selectBestPlays(OtherPlays,OtherValues,BestValue,BestPlays).
	
	
getBestPlays(Game, Plays, BestPlays):-
	getPlayValues(Game,Plays,Values),
	max_member(BestValue,Values),
	selectBestPlays(Plays,Values,BestValue,BestPlays).
	
		
getHardBotPlay(Game,ResPlay,Turn):-
	findall(Play,validPlay(Game,Play,Turn),Plays),
	getBestPlays(Game,Plays,BestPlays),
	getRandomPlay(BestPlays,ResPlay).