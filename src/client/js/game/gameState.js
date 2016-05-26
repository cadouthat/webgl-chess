//Helpful chess constants
const BOARD_ROW_COUNT = 8;
const BOARD_SCALE = 5.82;

//Represents a player's chess piece
function ChessPiece(owner, type, position)
{
	this.owner = owner;
	this.type = type;
	this.position = position;

	//Get position in 2D relative to center of board
	this.getNormalizedPosition = function()
	{
		//Offset position to center of space
		var x = this.position[0] + 0.5;
		var y = this.position[1] + 0.5;
		//Scale to portion of total spaces
		x /= BOARD_ROW_COUNT;
		y /= BOARD_ROW_COUNT;
		//Normalize to -1, 1
		x = x * 2 - 1;
		y = y * 2 - 1;
		return [x, y];
	};

	//Get position in 3D world space
	this.getWorldPosition = function()
	{
		var npos = this.getNormalizedPosition();
		return new vec3(npos[0] * BOARD_SCALE, 0, npos[1] * BOARD_SCALE);
	};
}

//Represents the state of a game of chess at a single point in time
function ChessGame()
{
	//Pieces on the board
	this.pieces = [];
	//Pieces removed from play
	this.graveyard = [];
	//Player currently moving
	this.turn = "white";
	//Game is in "check" status
	this.check = false;
	//Game is over
	this.checkmate = false;

	//Find the piece at position (if any)
	this.pieceAt = function(pos)
	{
		for(var i = 0; i < this.pieces.length; i++)
		{
			if(this.pieces[i].position[0] == pos[0] &&
				this.pieces[i].position[1] == pos[1])
			{
				return this.pieces[i];
			}
		}
		return null;
	};

	//Get position of a board space in world space
	this.getSpaceWorldPosition = function(pos) {
		const spaceWidth = BOARD_SCALE * 2 / BOARD_ROW_COUNT;
		return new vec3(
			(pos[0] + 0.5) * spaceWidth - BOARD_SCALE,
			0,
			(pos[1] + 0.5) * spaceWidth - BOARD_SCALE);
	};

	//Shorthand helper for adding a row of pieces
	this._addRow = function(owner, row, types)
	{
		var iRow = row - 1;
		for(var iCol = 0; iCol < BOARD_ROW_COUNT; iCol++)
		{
			this.pieces.push(new ChessPiece(owner, 
				(types instanceof Array) ? types[iCol] : types,
				[iCol, iRow]));
		}
	};

	//Load initial board layout
	this._addRow("white", 1, ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"]);
	this._addRow("white", 2, "pawn");
	this._addRow("black", 7, "pawn");
	this._addRow("black", 8, ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"]);
}
