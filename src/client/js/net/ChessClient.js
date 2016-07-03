function ChessClient(gameIn)
{
	this.game = gameIn;
	//Internal websocket handle
	this._sock = null;
	//Current state
	this.connected = false;
	this.error = false;
	this.myColor = null;
	this.opponentLeft = false;
	this.whiteTimer = settings.turnTimeLimit;
	this.blackTimer = settings.turnTimeLimit;
	this.timerFragment = 0;
	//Handlers for changes in the client state
	this.update = function(client){};
	this.opponentMove = function(from, to, promoteToName){};
	this.displayChat = function(player, msg){};
	this.displayClock = function(whiteTime, blackTime){};

	this.open = function()
	{
		//Reset before connecting
		this.close();

		//Open socket to current host on the game data port
		this._sock = new WebSocket("ws://" + window.location.hostname + ":" + settings.wsPort + "/");

		//Setup event handlers
		var _this = this;
		this._sock.onopen = function()
		{
			_this.connected = true;
			_this.update(_this);
		};

		this._sock.onmessage = function(event)
		{
			var msg = JSON.parse(event.data);
			switch(msg.type)
			{
			case "start":
				_this.myColor = msg.assignedColor;
				break;
			case "move":
				_this.opponentMove(msg.from, msg.to, msg.promoteTo);
				//Synchronize time with server
				_this.whiteTimer = msg.whiteTimer;
				_this.blackTimer = msg.blackTimer;
				_this._updateClockText();
				break;
			case "leave":
				_this.opponentLeft = true;
				break;
			case "chat":
				_this.displayChat(msg.player, msg.text);
				break;
			}
			_this.update(_this);
		};

		this._sock.onclose = function()
		{
			_this.connected = false;
			_this.error = true;
			_this.update(_this);
		};
	};

	this.send = function(msg)
	{
		if(this._sock != null) {
			this._sock.send(JSON.stringify(msg));
		}
	};

	this.move = function(from, to, promoteToName)
	{
		this.send({
			"type": "move",
			"from": from,
			"to": to,
			"promoteTo": promoteToName
		});
		this.update(this);
	};

	this.chat = function(text)
	{
		if(!this.connected || !this.myColor)
		{
			this.displayChat(null, "You can't send messages at the moment.");
			return false;
		}
		this.displayChat(this.myColor, text);
		this.send({
			"type": "chat",
			"text": text
		});
		return true;
	};

	this.isGameActive = function()
	{
		return this.connected && this.myColor && !this.opponentLeft && this.game && !this.game.isCheckmate && !this.game.isDraw;
	};

	this._formatTime = function(totalSeconds)
	{
		var seconds = totalSeconds % 60;
		var minutes = (totalSeconds - seconds) / 60;
		return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
	};

	this._updateClockText = function()
	{
		var whiteText = this._formatTime(this.whiteTimer);
		var blackText = this._formatTime(this.blackTimer);
		this.displayClock(whiteText, blackText);
	};

	this.tickTurn = function(span)
	{
		//Clock only runs while game is active
		if(this.isGameActive())
		{
			this.timerFragment += span;
			while(this.timerFragment > 1)
			{
				this.timerFragment -= 1;
				//Reduce the clock for the active player
				if(this.game.turn == "white")
				{
					this.whiteTimer = Math.max(0, this.whiteTimer - 1);
				}
				else
				{
					this.blackTimer = Math.max(0, this.blackTimer - 1);
				}
				//Display the new time
				this._updateClockText();
			}
		}
	};

	this.close = function()
	{
		if(this._sock != null) {
			this._sock.close();
		}
		this.connected = false;
		this.error = false;
		this.myColor = null;
		this.update(this);
	};
}
