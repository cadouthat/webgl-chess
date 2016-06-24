function ChessRenderer(game)
{
	//Constants
	this.BIRTH_DURATION = 0.75;
	this.BIRTH_HEIGHT = 30;
	this.MOVE_DURATION = 0.5;
	this.MOVE_HEIGHT = 3;

	this.game = game;
	this.pieces = [];

	this._add = function(gamePiece)
	{
		this.pieces.push({
			"gamePiece": gamePiece,
			"gamePosition": gamePiece.position,
			"worldPosition": getSpaceWorldPosition(gamePiece.position),
			"birth": true,
			"death": false,
			"glowColor": null,
			"viewDistance": 0,
			"animTimer": 0
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
			this.pieces[i].death = true;
		}

		//Add any game pieces that are missing
		for(var i = 0; i < this.game.pieces.length; i++)
		{
			var gamePiece = this.game.pieces[i];
			var piece = this._findByGamePiece(gamePiece);
			if(piece)
			{
				piece.death = false;
			}
			else
			{
				this._add(gamePiece);
			}
		}

		//Update animated positions
		for(var i = 0; i < this.pieces.length; i++)
		{
			var piece = this.pieces[i];
			piece.animTimer += span;
			if(piece.birth)
			{
				var p = piece.animTimer / this.BIRTH_DURATION;
				if(p >= 1)
				{
					p = 1;
					piece.birth = false;
				}
				piece.worldPosition.y = this.BIRTH_HEIGHT * (1 - p);
			}
			else if(piece.death)
			{
				var p = piece.animTimer / this.BIRTH_DURATION;
				if(p >= 1)
				{
					p = 1;
				}
				piece.worldPosition.y = this.BIRTH_HEIGHT * p;
			}
			else if(!this.game.equalSpaces(piece.gamePosition, piece.gamePiece.position))
			{
				var startPosition = getSpaceWorldPosition(piece.gamePosition);
				var endPosition = getSpaceWorldPosition(piece.gamePiece.position);
				var p = piece.animTimer / this.MOVE_DURATION;
				if(p >= 1)
				{
					p = 1;
				}
				piece.worldPosition.x = startPosition.x + (endPosition.x - startPosition.x) * p;
				piece.worldPosition.z = startPosition.z + (endPosition.z - startPosition.z) * p;

				if(piece.gamePiece.constructor == ChessKnight ||
					(piece.gamePiece.constructor == ChessKing && Math.abs(piece.gamePosition[0] - piece.gamePiece.position[0]) == 2))
				{
					piece.worldPosition.y = this.MOVE_HEIGHT * (1 - Math.pow(p * 2 - 1, 2));
				}

				if(p >= 1)
				{
					piece.gamePosition = [piece.gamePiece.position[0],
						piece.gamePiece.position[1]];
				}
			}
			else
			{
				piece.animTimer = 0;
			}
		}


		//Remove dead pieces
		for(var i = 0; i < this.pieces.length;)
		{
			var piece = this.pieces[i];
			if(piece.death && piece.animTimer >= this.BIRTH_DURATION)
			{
				this.pieces.splice(i, 1);
			}
			else i++;
		}
	};

	this.pieceAt = function(gamePosition)
	{
		for(var i = 0; i < this.pieces.length; i++)
		{
			var piece = this.pieces[i];
			if(!piece.death && this.game.equalSpaces(piece.gamePiece.position, gamePosition))
			{
				return piece;
			}
		}
		return null;
	};
}
