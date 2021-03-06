function ChessRook()
{
	this.owner = null;
	this.position = null;

	//Get details for a proposed move
	this.interpretMove = function(move)
	{
		//Path must be clear
		if(!move.game.isPathClear(move.from, move.to))
		{
			return false;
		}
		var files = Math.abs(move.to[0] - move.from[0]);
		var ranks = Math.abs(move.to[1] - move.from[1]);
		//Can move any amount in rank or file, but not both
		if(files == 0 || ranks == 0)
		{
			return true;
		}
		return false;
	};
}

ChessRook.pieceName = "rook";

if(typeof module != "undefined") {
	module.exports = ChessRook;
}
