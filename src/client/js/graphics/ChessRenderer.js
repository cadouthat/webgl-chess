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

	//Find a piece representing a given game piece object
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
		for(var i = 0; i < this.pieces.length; i++)
		{
			var piece = this.pieces[i];
			//Pre-mark all current pieces as dead
			piece.death = true;
			//Update promoted pieces with their replacements
			if(piece.gamePiece.constructor == ChessPawn && piece.gamePiece.wasPromoted)
			{
				piece.gamePiece = this.game.pieceAt(piece.gamePiece.position);
				piece.promotionType = piece.gamePiece.constructor;
				//Display as a pawn until animation completes
				piece.displayType = ChessPawn;
			}
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
			var targetPosition = piece.overridePosition || piece.gamePiece.position;
			piece.animTimer += span;
			if(piece.birth)
			{
				//Fall from the sky
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
				//Rise to the sky
				var p = piece.animTimer / this.BIRTH_DURATION;
				if(p >= 1)
				{
					p = 1;
				}
				piece.worldPosition.y = this.BIRTH_HEIGHT * p;
			}
			else if(!this.game.equalSpaces(piece.gamePosition, targetPosition))
			{
				var startPosition = getSpaceWorldPosition(piece.gamePosition);
				var endPosition = getSpaceWorldPosition(targetPosition);
				var p = piece.animTimer / this.MOVE_DURATION;
				if(p >= 1)
				{
					p = 1;
				}

				//Add a vertical arc for knights and castling kings
				if((piece.displayType || piece.gamePiece.constructor) == ChessKnight ||
					(piece.gamePiece.constructor == ChessKing && Math.abs(piece.gamePosition[0] - targetPosition[0]) == 2))
				{
					piece.worldPosition.x = startPosition.x + (endPosition.x - startPosition.x) * p;
					piece.worldPosition.z = startPosition.z + (endPosition.z - startPosition.z) * p;
					piece.worldPosition.y = this.MOVE_HEIGHT * (1 - Math.pow(p * 2 - 1, 2));
				}
				else
				{
					//Add a slight ease to the start and end speed
					var p_ease = p;
					var t = piece.animTimer;
					t /= (this.MOVE_DURATION / 2);
					if(t < 1)
					{
						p_ease = Math.pow(t, 3) / 2;
					}
					else
					{
						t -= 2;
						p_ease = Math.pow(t, 3) / 2 + 1;
					}
					if(p >= 1)
					{
						p_ease = 1;
					}
					//Interpolate start to end motion
					piece.worldPosition.x = startPosition.x + (endPosition.x - startPosition.x) * p_ease;
					piece.worldPosition.z = startPosition.z + (endPosition.z - startPosition.z) * p_ease;
				}

				//Update cached position after animation ends
				if(p >= 1)
				{
					piece.gamePosition = [targetPosition[0],
						targetPosition[1]];
				}
			}
			else
			{
				piece.animTimer = 0;
			}

			//Swap promotion models after movement
			if(piece.promotionType && piece.animTimer == 0)
			{
				if(piece.displayType == ChessPawn)
				{
					piece.displayType = null;
				}
				else
				{
					//Display as the pending promotion
					piece.displayType = piece.promotionType;
				}
			}
		}


		//Remove dead pieces
		for(var i = 0; i < this.pieces.length;)
		{
			var piece = this.pieces[i];
			//Wait until death animation is complete
			if(piece.death && piece.animTimer >= this.BIRTH_DURATION)
			{
				this.pieces.splice(i, 1);
			}
			else i++;
		}
	};

	//Find a piece with a matching game position
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
