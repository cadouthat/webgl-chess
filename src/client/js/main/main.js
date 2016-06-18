var game;
var client;

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
		//TEST
		if(client.connected)
		{
			if(client.myColor == null)
			{
				console.log("Waiting for opponent..");
			}
			else
			{
				console.log("(in game status)");
			}
		}
		else if(client.error)
		{
			console.log("Connection lost.");
		}
		else
		{
			console.log("Connecting to server..");
		}
		//TEST
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
