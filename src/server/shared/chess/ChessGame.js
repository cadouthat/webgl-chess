if(typeof require != "undefined") {
	ChessPawn = require("./ChessPawn");
	ChessRook = require("./ChessRook");
	ChessKnight = require("./ChessKnight");
	ChessBishop = require("./ChessBishop");
	ChessQueen = require("./ChessQueen");
	ChessKing = require("./ChessKing");
}

//Represents the state of a game of chess at a single point in time
function ChessGame()
{
	//Pieces on the board
	this.pieces = [];
	//Cached piece index by position (column-major)
	this.piecesByPosition = null;
	this.piecesByPositionValid = false;
	//Pieces removed from play
	this.graveyard = [];
	//Player currently moving
	this.turn = "white";
	//Player moving has lost
	this.isCheckmate = false;
	//Game ends in a tie
	this.isDraw = false;

	//Create a duplicate of the current game state
	this._clone = function()
	{
		var obj = new ChessGame();
		obj.turn = this.turn;
		obj.pieces = [];
		for(var i = 0; i < this.pieces.length; i++)
		{
			obj.pieces.push(this._clonePiece(this.pieces[i]));
		}
		return obj;
	};

	//Clone a chess piece
	this._clonePiece = function(piece)
	{
		var obj = new piece.constructor();
		obj.owner = piece.owner;
		obj.position = [piece.position[0], piece.position[1]];
		obj.wasPromoted = piece.wasPromoted;
		return obj;
	};

	//Initialize move object
	this._createMove = function()
	{
		return {
			"game": this,
			"from": null,
			"to": null,
			"forward": null,
			"moves": [],
			"capture": null,
			"promotion": null,
			"promoteTo": null
		};
	}

	//Clone a move, converting pieces to corresponding pieces in this game
	this._cloneMove = function(move)
	{
		//Copy basic fields into new move
		var obj = this._createMove();
		obj.from = move.from;
		obj.to = move.to;
		obj.forward = move.forward;
		//Duplicate move list
		for(var i = 0; i < move.moves.length; i++)
		{
			var m = move.moves[i];
			obj.moves.push({
				"piece": this.pieceAt(m.piece.position),
				"dest": [m.dest[0], m.dest[1]]
			});
		}
		//Duplicate capture and promotion pieces
		if(move.capture != null)
		{
			obj.capture = this.pieceAt(move.capture.position);
		}
		if(move.promotion != null)
		{
			obj.promotion = this.pieceAt(move.promotion.position);
		}
		return obj;
	};

	//Helper for initializing a piece
	this._createPiece = function(owner, type, position)
	{
		var piece = new type();
		piece.owner = owner;
		piece.position = [position[0], position[1]];
		piece.wasPromoted = false;
		return piece;
	};

	//Shorthand helper for adding a row of pieces
	this._addRow = function(owner, row, types)
	{
		var iRow = row - 1;
		for(var iCol = 0; iCol < 8; iCol++)
		{
			this.pieces.push(this._createPiece(owner, 
				(types instanceof Array) ? types[iCol] : types,
				[iCol, iRow]));
		}
		this.piecesByPositionValid = false;
	};

	//Helper for finding and removing a piece from the active piece list
	this._removePiece = function(piece, addToGraveyard)
	{
		//Remove from active piece list
		var ind = this.pieces.indexOf(piece);
		if(ind >= 0)
		{
			this.pieces.splice(ind, 1);
		}
		//Add to graveyard if requested
		if(addToGraveyard)
		{
			this.graveyard.push(piece);
		}
		this.piecesByPositionValid = false;
	};

	//Helper for comparing board spaces
	this.equalSpaces = function(a, b)
	{
		if(!a && !b) return true;
		if(!a || !b) return false;
		return (a[0] == b[0] && a[1] == b[1]);
	};

	//Validate a space and convert to integer values
	this.validateSpace = function(pos)
	{
		if(pos.length != 2) return false;
		pos[0] = parseInt(pos[0]);
		pos[1] = parseInt(pos[1]);
		if(isNaN(pos[0])) return false;
		if(isNaN(pos[1])) return false;
		return (pos[0] >= 0 && pos[0] < 8 &&
			pos[1] >= 0 && pos[1] < 8);
	};

	//Find the piece at position (if any)
	this.pieceAt = function(pos)
	{
		//Update piece position cache
		if(!this.piecesByPositionValid)
		{
			if(this.piecesByPosition)
			{
				//Clear the existing array
				for(var i = 0; i < 8 * 8; i++)
				{
					this.piecesByPosition[i] = null;
				}
			}
			else
			{
				//Initialize new array
				this.piecesByPosition = [];
				for(var i = 0; i < 8 * 8; i++)
				{
					this.piecesByPosition.push(null);
				}
			}
			//Assign existing pieces to current indices
			for(var i = 0; i < this.pieces.length; i++)
			{
				var piece = this.pieces[i];
				this.piecesByPosition[piece.position[0] * 8 + piece.position[1]] = piece;
			}
			this.piecesByPositionValid = true;
		}
		return this.piecesByPosition[pos[0] * 8 + pos[1]];
	};

	//Find a player's king
	this.findKing = function(player)
	{
		for(var i = 0; i < this.pieces.length; i++)
		{
			if(this.pieces[i].owner == player &&
				this.pieces[i].constructor == ChessKing)
			{
				return this.pieces[i];
			}
		}
		return null;
	};

	//Determine the piece (if any) threatening a player's king
	this.findCheck = function(player)
	{
		var king = this.findKing(player);
		//Check all enemy pieces for possible captures
		for(var i = 0; i < this.pieces.length; i++)
		{
			if(this.pieces[i].owner != player)
			{
				if(this.interpretMove(this.pieces[i].position, king.position) != null)
				{
					return this.pieces[i];
				}
			}
		}
		return null;
	};

	//The player taking their turn can make at least one legal move
	this.hasLegalMove = function()
	{
		//Dumb brute-force check for any owned piece moving to any position
		for(var i = 0; i < this.pieces.length; i++)
		{
			var srcPiece = this.pieces[i];
			if(srcPiece.owner == this.turn)
			{
				var tmpPos = [0, 0];
				for(var j = 0; j < 8; j++)
				{
					tmpPos[0] = j;
					for(var k = 0; k < 8; k++)
					{
						tmpPos[1] = k;
						//Cannot self capture
						var destPiece = this.pieceAt(tmpPos);
						if(destPiece == null || destPiece.owner != this.turn)
						{
							//Check if move is legal
							if(this.interpretMove(srcPiece.position, tmpPos) != null)
							{
								return true;
							}
						}
					}
				}
			}
		}
		return false;
	};

	//Check for end-of-game scenarios
	this.updateGameEnding = function()
	{
		//The game is over when the player has no moves
		if(!this.hasLegalMove())
		{
			//Player loses if in check
			if(this.findCheck(this.turn) != null)
			{
				this.isCheckmate = true;
			}
			else
			{
				this.isDraw = true;
			}
			return true;
		}
		return false;
	};

	//Check if a path is clear, excluding start and end
	this.isPathClear = function(from, to)
	{
		//Get direction of movement
		var dx = to[0] - from[0];
		var dy = to[1] - from[1];
		if(dx != 0) dx /= Math.abs(dx);
		if(dy != 0) dy /= Math.abs(dy);
		//Offset one space from start
		var x = from[0] + dx;
		var y = from[1] + dy;
		//Move up to, but not including end
		while(x != to[0] || y != to[1])
		{
			//Check for obstruction
			if(this.pieceAt([x, y]) != null)
			{
				return false;
			}
			if(x != to[0]) x += dx;
			if(y != to[1]) y += dy;
		}
		return true;
	};

	//Validate a move and return details
	this.interpretMove = function(from, to, blockedBy)
	{
		//Validate spaces
		if(!this.validateSpace(from) ||
			!this.validateSpace(to) ||
			this.equalSpaces(from, to))
		{
			return null;
		}
		//Get piece to be moved, must exist
		var piece = this.pieceAt(from);
		if(piece == null)
		{
			return null;
		}
		//Create empty move object
		var move = this._createMove();
		//Add the basic piece movement
		move.from = from;
		move.to = to;
		move.forward = (piece.owner == "white" ? 1 : -1);
		move.moves.push({
			"piece": piece,
			"dest": to
		});
		//If the destination contains a piece, it will be captured
		move.capture = this.pieceAt(to);
		//Validate and add details based on the piece type
		if(!piece.interpretMove(move))
		{
			return null;
		}
		//Unless capturing the king, this move must not leave the player in check
		if(!move.capture || move.capture.constructor != ChessKing)
		{
			//Clone the game state for testing
			var testGame = this._clone();
			var testMove = testGame._cloneMove(move);
			//Placeholder for promotion since it shouldn't affect outcome
			testMove.promoteTo = ChessQueen;
			//Execute the proposed move
			if(!testGame._executeMove(testMove))
			{
				return null;
			}
			//Test check state for the player moving
			var wouldCheck = testGame.findCheck(this.turn);
			if(wouldCheck)
			{
				if(blockedBy)
				{
					blockedBy.push(this.pieceAt(wouldCheck.position));
				}
				return null;
			}
		}
		return move;
	};

	//Execute a prepared move
	this._executeMove = function(move)
	{
		//Promotion choice must be provided if relevant
		if(move.promotion && !move.promoteTo)
		{
			return false;
		}
		//Move
		for(var i = 0; i < move.moves.length; i++)
		{
			var piece = move.moves[i].piece;
			var dest = move.moves[i].dest;
			this.lastMoved = piece;
			piece.lastPosition = piece.position;
			piece.position = dest;
		}
		//Capture
		if(move.capture)
		{
			//Remove piece and add to graveyard
			this._removePiece(move.capture, true);
		}
		//Promote
		if(move.promotion)
		{
			//Remove old piece
			move.promotion.wasPromoted = true;
			this._removePiece(move.promotion);
			//Add new piece at same position
			var newPiece = this._createPiece(this.turn, move.promoteTo, move.promotion.position);
			newPiece.wasPromoted = true;
			this.pieces.push(newPiece);
			this.lastMoved = newPiece;
			newPiece.lastPosition = move.promotion.lastPosition;
		}
		//Flag position cache to be refreshed
		this.piecesByPositionValid = false;
		//Swap turns
		this.turn = (this.turn == "white") ? "black" : "white";
		return true;
	};

	//Validate and execute a move
	this.doMove = function(from, to, promoteToName)
	{
		//No more moves if the game is over
		if(this.isDraw || this.isCheckmate)
		{
			return false;
		}
		//Get piece to be moved, must be valid and owned by player
		var piece = this.pieceAt(from);
		if(piece == null || piece.owner != this.turn)
		{
			return false;
		}
		//Interpret details
		var move = this.interpretMove(from, to);
		if(!move)
		{
			return false;
		}
		//Cannot capture self
		if(move.capture != null && move.capture.owner == this.turn)
		{
			return false;
		}
		if(move.promotion)
		{
			//Convert the type name to prototype object
			var allTypes = [ChessRook, ChessKnight, ChessBishop, ChessQueen];
			for(var i = 0; i < allTypes.length; i++)
			{
				if(promoteToName == allTypes[i].pieceName)
				{
					move.promoteTo = allTypes[i];
					break;
				}
			}
		}
		if(!this._executeMove(move))
		{
			return false;
		}
		//Update state
		this.updateGameEnding();
		return true;
	};

	//Load initial board layout
	this._addRow("white", 1, [ChessRook, ChessKnight, ChessBishop, ChessQueen, ChessKing, ChessBishop, ChessKnight, ChessRook]);
	this._addRow("white", 2, ChessPawn);
	this._addRow("black", 7, ChessPawn);
	this._addRow("black", 8, [ChessRook, ChessKnight, ChessBishop, ChessQueen, ChessKing, ChessBishop, ChessKnight, ChessRook]);
}

if(typeof module != "undefined") {
	module.exports = ChessGame;
}
