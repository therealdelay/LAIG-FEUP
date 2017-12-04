%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%% MENUS %%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%

gorogo:-
	clearScreen,
	mainMenu.

mainMenu:-
	clearScreen,
	write('********************'),nl,
	write('*******GoRoGo*******'),nl,
	write('********************'),nl,
	write('*                  *'),nl,
	write('*    Main  Menu    *'),nl,
	write('*                  *'),nl,
	write('* 1 - Play         *'),nl,
	write('* 2 - Rules        *'),nl,
	write('* 3 - About        *'),nl,
	write('*                  *'),nl,
	write('* 0 - Exit         *'),nl,
	write('*                  *'),nl,
	write('********************'),nl,
	write(' Option:            '),nl,
	readOption(Option),
	write(Option),nl,
	integer(Option), Option >= 0, Option < 4, !,
	processOption(Option).
	
mainMenu:-
	clearScreen,
	write('Error: invalid input.'), nl,
	mainMenu.

processOption(0):- !.
processOption(Option):-
	ite(Option == 1, (initGamePvP(Game),playMenu(Game)), true), !,
	ite(Option == 2, rulesMenu, true), !,
	ite(Option == 3, aboutMenu, true), !, nl,
	waitForEnter.

		
playMenu(Game):-
	clearScreen,
	write('********************************'),nl,
	write('*************GoRoGo*************'),nl,
	write('********************************'),nl,
	write('*                              *'),nl,
	write('* 1 - Play                     *'),nl,
	write('*                              *'),nl,
	write('*                              *'),nl,
	write('* White Player    Black Player *'),nl,
	write('*                              *'),nl,
	printPlayersType(Game),
	write('*                              *'),nl,	
	write('*                              *'),nl,
	write('*                              *'),nl,
	write('* 2 - Config White Player      *'),nl,
	write('* 3 - Config Black Player      *'),nl,
	write('*                              *'),nl,
	write('* 0 - Back                     *'),nl,
	write('*                              *'),nl,
	write('********************************'),nl,
	write(' Option:            '),nl,
	readOption(Option),
	integer(Option), Option >= 0, Option < 4, !,
	ite(Option == 1, play(Game), true), !,
	ite(Option == 2, playerConfigMenu(Game,whitePlayer), true), !,
	ite(Option == 3, playerConfigMenu(Game, blackPlayer), true), !,
	ite(Option == 0, gorogo, true), !.
	
	
playMenu(Game):-
	clearScreen,
	write('Error: invalid input.'), nl,
	playMenu(Game).
	
	
playerConfigMenu(Game,Player):-
	nl,nl,
	write(' Select new player type: '),nl,
	write('    1- Human'),nl,
	write('    2- Easy Bot'),nl,
	write('    3- Hard Bot'),nl,
	write(' Option:            '),nl,
	repeat,
		readOption(Option),
		integer(Option), Option > 0, Option < 4, !,
		ite(Option == 1, (setGamePlayerType(Game,Player,human,GameRes), playMenu(GameRes)), true), !,
		ite(Option == 2, (setGamePlayerType(Game,Player,easyBot,GameRes), playMenu(GameRes)), true), !,
		ite(Option == 3, (setGamePlayerType(Game,Player,hardBot,GameRes), playMenu(GameRes)), true), !.
	

playMenu:-
	clearScreen,
	write('Error: invalid input.'), nl,
	playMenu.

rulesMenu:-
	clearScreen,
	write('********************'),nl,
	write('*******GoRoGo*******'),nl,
	write('********************'),nl,
	write('*                  *'),nl,
	write('*      Rules       *'),nl,
	write('*                  *'),nl,
	write('********************'),nl,
	write('-> Each player starts with 10 regular pieces and 2 Henge. The remaining Henge piece is played by the White to begin the game.'),nl,
	write('-> Henge pieces are considered both Black and White, according to the current player, i.e. while White plays, Henge are considered White, while Black plays, Henge are considered Black.'),nl,
	write('-> Pieces can\'t be moved once they are played.'),nl,
	write('-> A piece or a group of pieces chained with paths are conquered when they have no adjacent empty places. When conquered, pieces are removed from the board.'),nl,
	write('-> Henge pieces are never conquered.'),nl,
	write('-> A regular piece can\'t be played in a place surrounded by enemy pieces, unless that results in conquering enemy pieces or at least 1 of the surrounding pieces is Henge.'),nl,
	write('-> Players must play all Henge pieces before their last move.'),nl,
	write('-> It is not possible to pass a turn, so if a player has no valid moves, he loses.'),nl,
	write('-> The game can never end tied, so in case of tie, the winner is always the white.'),nl,nl,
	write('-> Press enter to get back.'),nl,
	waitForEnter,
	gorogo.

aboutMenu:-
	clearScreen,
	write('********************'),nl,
	write('*******GoRoGo*******'),nl,
	write('********************'),nl,
	write('*                  *'),nl,
	write('*   About GoRoGo   *'),nl,
	write('*                  *'),nl,
	write('********************'),nl,nl,
	write('GoRoGo is a variation of Go, that came from China, about 2500 years ago.'), nl,
	write('GoRoGo was designed for two players, each with 10 regular pieces (black and white) and 2 Henge pieces, that fit both players, being black and white.'),nl,
	write('There is anothter Henge piece, that is played by the whites to begin the game.'),nl,
	write('GoRoGo is played on a 5x5 board, with 25 intersections and 40 paths.'),nl,
	write('The purpose of the game is to obtain more of your opponent\'s pieces.'),nl,
	write('A player can\'t pass a turn, not play a Henge piece at last, so if they have no legal moves, they lose.'),nl,
	write('Henge pieces are both black and white, i.e., on black\'s turn, it is considered a black piece, while on white\'s turn, it is considered white.'),nl,
	write('The Henge pieces are considered the key to making GoRoGo an exciting alternative to its ancestor, Go.'),nl,nl,
	write('-> Press enter to get back.'),nl,
	waitForEnter,
	gorogo.