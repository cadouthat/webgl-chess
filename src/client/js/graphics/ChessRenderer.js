function ChessRenderer(game)
{
	this.game = game;
	this.pieces = [];

	this._add = function(gamePiece)
	{
		this.pieces.push({
			"gamePiece": gamePiece,
			"worldPosition": getSpaceWorldPosition(gamePiece.position),
			"dead": false,
			"glowColor": null,
			"viewDistance": 0
		});
	};

	this._findByGamePiece = function(gamePiece)
	{
		for(var i = 0; i < this.pieces.length; i++)
		{
			var piece = this.pieces[i];
			if(piece.gamePiece == gamePiece)
			{
				return piece;
			}
		}
		return null;
	};

	this.update = function(span)
	{
		//Pre-mark all current pieces as dead
		for(var i = 0; i < this.pieces.length; i++)
		{
			this.pieces[i].dead = true;
		}

		//Add any game pieces that are missing
		for(var i = 0; i < this.game.pieces.length; i++)
		{
			var gamePiece = this.game.pieces[i];
			var piece = this._findByGamePiece(gamePiece);
			if(piece)
			{
				piece.dead = false;
			}
			else
			{
				this._add(gamePiece);
			}
		}

		//TODO animate piece birth
		//TODO animate piece movement
		//TODO animate piece death
		//TODO remove dead pieces (after animation)

		//TEST
		for(var i = 0; i < this.pieces.length;)
		{
			var piece = this.pieces[i];
			if(piece.dead)
			{
				this.pieces.splice(i, 1);
			}
			else
			{
				piece.worldPosition = getSpaceWorldPosition(piece.gamePiece.position);
				i++;
			}
		}
		//
	};

	this.pieceAt = function(gamePosition)
	{
		for(var i = 0; i < this.pieces.length; i++)
		{
			var piece = this.pieces[i];
			if(this.game.equalSpaces(piece.gamePiece.position, gamePosition))
			{
				return piece;
			}
		}
		return null;
	};
}
