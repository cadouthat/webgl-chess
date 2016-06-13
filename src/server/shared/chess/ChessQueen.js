function ChessQueen()
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
		//Can move any amount in rank, file, or an equal amount in both (diagonal)
		if(files == 0 || ranks == 0 || files == ranks)
		{
			return true;
		}
		return false;
	};
}

if(typeof module != "undefined") {
	module.exports = ChessQueen;
}
