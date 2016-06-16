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

//Listen for websocket requests on the http server
var wss = new WebSocketServer({ "server": httpServer });
wss.on("connection", function(sock) {
	sock.on("message", function(msg) {
		//
		console.log(msg);
		//
	});
	//
	sock.send(JSON.stringify({"event": "login", "description": "Welcome!"}));
	//
});
