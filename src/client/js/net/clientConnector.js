var client;

function initClient()
{
	//Create client and setup handlers
	client = new ChessClient(game);
	client.displayChat = function(player, text){
		if(player != client.myColor)
		{
			playSound(message_mp3);
		}
		displayChat(player, text);
	};
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
				playSoundOnce(connect_mp3);
				if(client.opponentLeft)
				{
					playSoundOnce(disconnect_mp3);
				}

				if(game.isCheckmate)
				{
					var isDefeat = (game.turn == client.myColor);
					playSoundOnce(isDefeat ? defeat_mp3 : victory_mp3);
					setGameResult(isDefeat ? "Defeat!" : "Victory!");
					setGameStatus(client.opponentLeft ? "Opponent left" : "No legal moves", false);
				}
				else if(game.isDraw)
				{
					playSoundOnce(victory_mp3);
					setGameResult("Draw!");
					setGameStatus(client.opponentLeft ? "Opponent left" : "No legal moves", false);
				}
				else if(client.outOfTime)
				{
					var isDefeat = (client.outOfTime == client.myColor);
					playSoundOnce(isDefeat ? defeat_mp3 : victory_mp3);
					setGameResult(isDefeat ? "Defeat!" : "Victory!");
					setGameStatus(client.opponentLeft ? "Opponent left" : "Time expired", false);
				}
				else if(client.opponentLeft)
				{
					playSoundOnce(victory_mp3);
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
			playSoundOnce(disconnect_mp3);
			setGameStatus("Connection lost", false);
		}
		else
		{
			setGameStatus("Connecting to server", true);
		}
	};
	client.opponentMove = function(from, to, promoteToName)
	{
		playSound(move_mp3);
		game.doMove(from, to, promoteToName);
		updateHover();
	};
	//Connect to server
	client.open();
}
