function ChessClient()
{
	this._sock = null;
	this.connected = false;
	this.error = false;
	this.myColor = null;

	this.open = function() {
		//Open socket to current host on the game data port
		this._sock = new WebSocket("ws://" + window.location.hostname + ":" + settings.ws_port + "/");
		//Setup event handlers
		this._sock.onopen = function() {
			this.connected = true;
			//
			this.send({"client": "test"});
			//
		};
		this._sock.onmessage = function(event) {
			//
			console.log(JSON.parse(event.data));
			//
		};
		this._sock.onclose = function() {
			this.connected = false;
			this.error = true;
		};
	};

	this.send = function(msg) {
		if(this._sock != null) {
			this._sock.send(JSON.stringify(msg));
		}
	};

	this.close = function() {
		if(this._sock != null) {
			this._sock.close();
		}
	};

	//Initiate connection automatically
	this.open();
}
