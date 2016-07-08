var client;

function initClient()
{
	//Create client and setup handlers
	client = new ChessClient(game);
	client.displayChat = displayChat;
	client.displayClock = displayClock;
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
					setGameStatus(client.opponentLeft ? "Opponent left" : "No legal moves", false);
				}
				else if(game.isDraw)
				{
					setGameResult("Draw!");
					setGameStatus(client.opponentLeft ? "Opponent left" : "No legal moves", false);
				}
				else if(client.outOfTime)
				{
					setGameResult((client.outOfTime == client.myColor) ? "Defeat!" : "Victory!");
					setGameStatus(client.opponentLeft ? "Opponent left" : "Time expired", false);
				}
				else if(client.opponentLeft)
				{
					setGameResult("Victory!");
					setGameStatus("Opponent left", false);
				}
				else
				{
					if(game.turn == client.myColor)
					{
						if(pendingPromotionMove)
						{
							setGameStatus("Promotion choice", false);
						}
						else
						{
							setGameStatus("Your move, " + game.turn, false);
						}
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
}
