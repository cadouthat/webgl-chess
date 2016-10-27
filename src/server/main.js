var http = require("http");
var WebSocketServer = require("ws").Server;
var sqlite3 = require('sqlite3').verbose();

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
	//Wait until at least one second has accumulated
	var curTime = new Date().getTime() / 1000;
	if(curTime - game.timerReference < 1)
	{
		return true;
	}
	//Update timer values
	var secondsPassed = Math.floor(curTime - game.timerReference);
	game.timerReference += secondsPassed;
	if(game.turn == "white")
	{
		game.whiteTimer = Math.max(0, game.whiteTimer - secondsPassed);
	}
	else
	{
		game.blackTimer = Math.max(0, game.blackTimer - secondsPassed);
	}
	//Keep clients in sync to avoid browser timing issues
	if(game.sessions)
	{
		//Send out of time notification to both players
		var msg = {
			"type": "sync",
			"whiteTimer": game.whiteTimer,
			"blackTimer": game.blackTimer
		};
		game.sessions[0].send(JSON.stringify(msg));
		game.sessions[1].send(JSON.stringify(msg));
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
			game.isOutOfTime = true;
		}
		return false;
	}
	return true;
}

function doCleanup()
{
	if(db) db.close();
}

function persistGame(gameObject)
{
	db.serialize(function() {
		db.run("INSERT INTO games DEFAULT VALUES", function(err) {
			gameObject.gameId = this.lastID;
		});
	});
}
function persistGameResult(gameObject, result)
{
	if(!gameObject.gameId) return;
	db.serialize(function() {
		db.run("UPDATE games SET result=? WHERE game_id=?", result, gameObject.gameId);
	});
}
function persistMove(gameObject, moveObject)
{
	if(!gameObject.gameId) return;
	db.serialize(function() {
		db.run("INSERT INTO moves (game_id, from_space, to_space, promote_to) " +
			"VALUES (?,?,?,?)",
			gameObject.gameId,
			moveObject.from.toString(),
			moveObject.to.toString(),
			moveObject.promoteTo);
	});
}

//Set cleanup handlers
process.on("exit", function() {
	doCleanup();
});
process.on("SIGINT", function() {
	process.exit();
});
process.on("uncaughtException", function(e) {
	console.log(e);
	process.exit();
});

//Open or create the database
var db = new sqlite3.Database("webgl-chess-db.sqlite");
db.serialize(function() {
	db.run("CREATE TABLE IF NOT EXISTS games ( " +
		"game_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"result TEXT)");
	db.run("CREATE TABLE IF NOT EXISTS moves ( " +
		"move_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"game_id INTEGER, " +
		"from_space TEXT, " +
		"to_space TEXT, " +
		"promote_to TEXT)");
});

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
		try
		{
			var msg = JSON.parse(data);

			switch(msg.type)
			{
			case "move":
				//Apply move to session game state
				if(sock.game.turn == sock.assignedColor &&
					checkGameTimers(sock.game) &&
					sock.game.doMove(msg.from, msg.to, msg.promoteTo))
				{
					//Save the move details
					persistMove(sock.game, msg);
					//Relay move to opponent
					if(sock.partner)
					{
						sock.partner.send(JSON.stringify({
							"type": "move",
							"from": msg.from,
							"to": msg.to,
							"promoteTo": msg.promoteTo
						}));
					}
				}
				else
				{
					console.log("Invalid move detected!");
					//Log move request (capped at 128 chars)
					var logData = data;
					if(logData.length > 128) logData = logData.substring(0, 128);
					var logGameState = {
						"draw": sock.game.isDraw || false,
						"checkmate": sock.game.isCheckmate || false,
						"outOfTime": sock.game.isOutOfTime || false
					};
					sock.game.abortReason = "Invalid move " + logData + ", game state " + JSON.stringify(logGameState);
					//Abort game
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
		}
		catch(err)
		{
			//Abort game
			sock.game.abortReason = "Exception handling message: " + err.message;
			sock.close();
		}
	});

	sock.on("close", function() {
		//If a partner is connected, notify them
		if(sock.partner)
		{
			sock.partner.game = null;
			sock.partner.partner = null;
			sock.partner.send(JSON.stringify({
				"type": "leave"
			}));
		}
		//Destroy game
		if(sock.game)
		{
			//Save result
			var gameResult = "";
			if(sock.game.abortReason)
			{
				gameResult = sock.game.abortReason;
			}
			else
			{
				if(sock.game.isCheckmate)
				{
					gameResult = "Checkmate";
				}
				else if(sock.game.isDraw)
				{
					gameResult = "Draw";
				}
				else if(sock.game.isOutOfTime)
				{
					gameResult = "Out of time";
				}
				else
				{
					gameResult = "Disconnected " + sock.assignedColor;
				}
			}
			gameResult += " (" + sock.game.turn + "'s turn)";
			persistGameResult(sock.game, gameResult);
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
		game.timerReference = new Date().getTime() / 1000;
		game.sessions = [sock, partner];
		activeGames.push(game);
		persistGame(game);
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

