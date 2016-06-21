function ChessBishop()
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
		//Can move on any diagonal path
		if(files == ranks)
		{
			return true;
		}
		return false;
	};
}

ChessBishop.pieceName = "bishop";

if(typeof module != "undefined") {
	module.exports = ChessBishop;
}
