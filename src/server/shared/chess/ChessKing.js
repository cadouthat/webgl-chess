function ChessKing()
{
	this.owner = null;
	this.position = null;

	//Get details for a proposed move
	this.interpretMove = function(move)
	{
		//
		return false;
	};
}

if(typeof module != "undefined") {
	module.exports = ChessKing;
}
