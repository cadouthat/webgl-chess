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

function displayChat(player, text)
{
	if(player)
	{
		player += ": ";
	}
	else player = "";
	var box = $("#chat_box");
	box.append(
		$("<p/>").append(
			$("<span/>").append(document.createTextNode(player)),
			document.createTextNode(text)
		)
	);
	box.scrollTop(box[0].scrollHeight);
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
	client.displayChat = displayChat;
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
				//TODO - game ended by expired turn timer
				if(client.opponentLeft)
				{
					setGameResult("Victory!");
					setGameStatus("Opponent left", false);
				}
				else if(game.isCheckmate)
				{
					setGameResult((game.turn == client.myColor) ? "Defeat!" : "Victory!");
					setGameStatus("No legal moves", false);
				}
				else if(game.isDraw)
				{
					setGameResult("Draw!");
					//TODO - distinguish stalemate from 50 move rule
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
