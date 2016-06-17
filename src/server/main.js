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

	sock.on("message", function(msg) {
		//
		console.log(msg);
		//
	});

	if(sessionWaiting.length)
	{
		var partner = sessionWaiting.splice(0, 1)[0];
		partner.assignedColor = "white";
		partner.partner = sock;
		partner.send(JSON.stringify({
			"type": "start",
			"assignedColor": partner.assignedColor
		}));
		sock.assignedColor = "black";
		sock.partner = partner;
		sock.send(JSON.stringify({
			"type": "start",
			"assignedColor": sock.assignedColor
		}));
		console.log("Session started");
	}
	else sessionWaiting.push(sock);
});
