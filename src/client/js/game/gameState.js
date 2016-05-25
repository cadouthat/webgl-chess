//Helpful chess constants
var BOARD_ROW_COUNT = 8;

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
