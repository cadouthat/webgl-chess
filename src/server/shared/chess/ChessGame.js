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
	//Pieces removed from play
	this.graveyard = [];
	//Player currently moving
	this.turn = "white";
	//Game is in "check" status
	this.check = false;
	//Game is over
	this.checkmate = false;

	//Helper for initializing a piece
	this._createPiece = function(owner, type, position)
	{
		var piece = new type();
		piece.owner = owner;
		piece.position = position;
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
	};

	//Helper for comparing board spaces
	this.equalSpaces = function(a, b)
	{
		if(!a && !b) return true;
		if(!a || !b) return false;
		return (a[0] == b[0] && a[1] == b[1]);
	};

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

	//Get details for a proposed move
	this.interpretMove = function(from, to)
	{
		//Get piece to be moved
		var piece = this.pieceAt(from);
		if(piece == null)
		{
			return null;
		}
		//Piece objects interpret details for their type
		return piece.interpretMove(to);
	};

	//Top level test for making a move
	this.canMove = function(from, to)
	{
		return this.interpretMove(from, to) != null;
	};

	//Load initial board layout
	this._addRow("white", 1, [ChessRook, ChessKnight, ChessBishop, ChessKing, ChessQueen, ChessBishop, ChessKnight, ChessRook]);
	this._addRow("white", 2, ChessPawn);
	this._addRow("black", 7, ChessPawn);
	this._addRow("black", 8, [ChessRook, ChessKnight, ChessBishop, ChessKing, ChessQueen, ChessBishop, ChessKnight, ChessRook]);
}

if(typeof module != "undefined") {
	module.exports = ChessGame;
}
