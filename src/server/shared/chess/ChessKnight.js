function ChessKnight()
{
	this.owner = null;
	this.position = null;

	//Get details for a proposed move
	this.interpretMove = function(move)
	{
		var files = Math.abs(move.to[0] - move.from[0]);
		var ranks = Math.abs(move.to[1] - move.from[1]);
		//Rank and file must be a combination of 1 and 2
		if(files == 1 && ranks == 2 ||
			files == 2 && ranks == 1)
		{
			return true;
		}
		return false;
	};
}

ChessKnight.pieceName = "knight";

if(typeof module != "undefined") {
	module.exports = ChessKnight;
}
