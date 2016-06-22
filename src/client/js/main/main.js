var game;
var client;

function setGameStatus(str, waiting)
{
	$("#status_text").text(str);
	$("#status_wait").css("display", waiting ? "block" : "none");
}

function setGameResult(str)
{
	$("#game_over").text(str);
}

$(window).ready(function()
{
	initGlContext();

	//Initial resize to be safe
	resizeCanvas();

	//Set up game state
	game = new ChessGame();

	//Start main draw loop
	draw(performance.now());

	//Create client and setup handlers
	client = new ChessClient();
	client.update = function(client)
	{
		if(client.connected)
		{
			if(client.myColor == null)
			{
				setGameStatus("Waiting for opponent", true);
			}
			else
			{
				if(game.isCheckmate)
				{
					setGameResult((game.turn == client.myColor) ? "Defeat!" : "Victory!");
					//TODO other end game scenarios
					setGameStatus("No legal moves", false);
				}
				else if(game.isDraw)
				{
					setGameResult("Draw!");
					//TODO other end game scenarios
					setGameStatus("No legal moves", false);
				}
				else
				{
					if(game.turn == client.myColor)
					{
						setGameStatus("Your move, " + game.turn, false);
					}
					else
					{
						setGameStatus(game.turn + " is moving", true);
					}
				}
			}
		}
		else if(client.error)
		{
			setGameStatus("Connection lost", false);
		}
		else
		{
			setGameStatus("Connecting to server", true);
		}
	};
	client.opponentMove = function(from, to, promoteToName)
	{
		game.doMove(from, to, promoteToName);
		updateHover();
	};
	//Connect to server
	client.open();
});

$(window).resize(function()
{
	resizeCanvas();
});
