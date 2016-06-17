function ChessClient()
{
	//Internal websocket handle
	this._sock = null;
	//Current state
	this.connected = false;
	this.error = false;
	this.myColor = null;
	//Handler for changes in the client state
	this.update = function(client){};

	this.open = function() {
		//Reset before connecting
		this.close();

		//Open socket to current host on the game data port
		this._sock = new WebSocket("ws://" + window.location.hostname + ":" + settings.ws_port + "/");

		//Setup event handlers
		var _this = this;
		this._sock.onopen = function() {
			_this.connected = true;
			_this.update(_this);
		};

		this._sock.onmessage = function(event) {
			var msg = JSON.parse(event.data);
			switch(msg.type)
			{
			case "start":
				_this.myColor = msg.assignedColor;
				_this.update(_this);
				break;
			}
		};

		this._sock.onclose = function() {
			_this.connected = false;
			_this.error = true;
			_this.update(_this);
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
		this.connected = false;
		this.error = false;
		this.myColor = null;
		this.update(this);
	};
}
