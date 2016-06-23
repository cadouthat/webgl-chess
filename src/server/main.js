var http = require("http");
var WebSocketServer = require("ws").Server;

var settings = require("./shared/settings");
var ChessGame = require("./shared/chess/ChessGame");

//Set up an HTTP server with cross-origin enabled
var httpServer = http.createServer(function(request, response) {
	response.writeHead(200, {
		"Access-Control-Allow-Origin": "*"
	});
	response.end();
}).listen(settings.ws_port);

//Global matchmaking queue
var sessionWaiting = [];

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
				sock.game.doMove(msg.from, msg.to, msg.promoteTo))
			{
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
				//TODO - log game/player details
				sock.close();
				//TODO - terminate session
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
		//If a partner is connected, notify them
		if(sock.partner)
		{
			sock.partner.send(JSON.stringify({
				"type": "leave"
			}));
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
		var game = new ChessGame();
		console.log("Session started");

		var partner = sessionWaiting.splice(0, 1)[0];
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
