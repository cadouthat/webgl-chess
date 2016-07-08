var http = require("http");
var WebSocketServer = require("ws").Server;

var settings = require("./shared/settings");
var ChessGame = require("./shared/chess/ChessGame");

function checkGameTimers(game)
{
	//Do nothing if time has already expired
	if(game.whiteTimer <= 0 || game.blackTimer <= 0)
	{
		return false;
	}
	//Do nothing if the game has ended
	if(game.isCheckmate || game.isDraw)
	{
		return false;
	}
	//Update timer values
	var curTime = new Date().getTime();
	var secondsPassed = Math.round((curTime - game.timerReference) / 1000);
	game.timerReference = curTime;
	if(game.turn == "white")
	{
		game.whiteTimer -= secondsPassed;
	}
	else
	{
		game.blackTimer -= secondsPassed;
	}
	//Send notifications if time just now expired
	if(game.whiteTimer <= 0 || game.blackTimer <= 0)
	{
		if(game.sessions)
		{
			//Send out of time notification to both players
			var msg = {
				"type": "outOfTime",
				"player": (game.whiteTimer <= 0) ? "white" : "black"
			};
			game.sessions[0].send(JSON.stringify(msg));
			game.sessions[1].send(JSON.stringify(msg));
		}
		return false;
	}
	return true;
}

//Set up an HTTP server with cross-origin enabled
var httpServer = http.createServer(function(request, response) {
	response.writeHead(200, {
		"Access-Control-Allow-Origin": "*"
	});
	response.end();
}).listen(settings.wsPort);

//Global matchmaking queue
var sessionWaiting = [];

//Global list of active games
var activeGames = [];

//Listen for websocket requests on the http server
var wss = new WebSocketServer({ "server": httpServer });
wss.on("connection", function(sock) {

	sock.on("message", function(data) {
		var msg = JSON.parse(data);
		switch(msg.type)
		{
		case "move":
			//Apply move to session game state
			if(sock.game.turn == sock.assignedColor &&
				checkGameTimers(sock.game) &&
				sock.game.doMove(msg.from, msg.to, msg.promoteTo))
			{
				//Relay move to opponent
				if(sock.partner)
				{
					sock.partner.send(JSON.stringify({
						"type": "move",
						"from": msg.from,
						"to": msg.to,
						"promoteTo": msg.promoteTo,
						"whiteTimer": sock.game.whiteTimer,
						"blackTimer": sock.game.blackTimer
					}));
				}
			}
			else
			{
				console.log("Invalid move detected!");
				//TODO - log game/player details
				sock.close();
			}
			break;
		case "chat":
			//Simply relay the message
			if(sock.partner)
			{
				sock.partner.send(JSON.stringify({
					"type": "chat",
					"text": msg.text,
					"player": sock.assignedColor
				}));
			}
			break;
		}
	});

	sock.on("close", function() {
		//Destroy game
		if(sock.game)
		{
			//Remove from active games
			var i = activeGames.indexOf(sock.game);
			if(i >= 0)
			{
				activeGames.splice(i, 1);
			}
			//Disconnect players from game
			sock.game.sessions = null;
			sock.game = null;
		}
		//If a partner is connected, notify them
		if(sock.partner)
		{
			sock.partner.send(JSON.stringify({
				"type": "leave"
			}));
			sock.partner.game = null;
			sock.partner.partner = null;
		}
		//Remove from queue
		if(sessionWaiting.length && sessionWaiting[0] == sock)
		{
			sessionWaiting.splice(0, 1);
		}
	});

	if(sessionWaiting.length)
	{
		var partner = sessionWaiting.splice(0, 1)[0];
		var game = new ChessGame();
		game.whiteTimer = settings.turnTimeLimit;
		game.blackTimer = settings.turnTimeLimit;
		game.timerReference = new Date().getTime();
		game.sessions = [sock, partner];
		activeGames.push(game);
		console.log("Session started");

		partner.game = game;
		partner.assignedColor = "white";
		partner.partner = sock;
		partner.send(JSON.stringify({
			"type": "start",
			"assignedColor": partner.assignedColor
		}));

		sock.game = game;
		sock.assignedColor = "black";
		sock.partner = partner;
		sock.send(JSON.stringify({
			"type": "start",
			"assignedColor": sock.assignedColor
		}));
	}
	else sessionWaiting.push(sock);
});

//Periodically check turn timers for all active games
setInterval(function() {
	for(var i = 0; i < activeGames.length; i++)
	{
		checkGameTimers(activeGames[i]);
	}
}, 500);
