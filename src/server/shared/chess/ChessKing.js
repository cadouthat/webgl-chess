if(typeof require != "undefined") {
	ChessRook = require("./ChessRook");
}

function ChessKing()
{
	this.owner = null;
	this.position = null;

	//Get details for a proposed move
	this.interpretMove = function(move)
	{
		var files = Math.abs(move.to[0] - move.from[0]);
		var ranks = Math.abs(move.to[1] - move.from[1]);
		//Can move up to 1 space in any rank and/or file
		if(files <= 1 && ranks <= 1)
		{
			return true;
		}
		//Special check for castling
		if(ranks == 0 && files == 2)
		{
			//King must not have moved
			if(this.lastPosition == undefined)
			{
				//There must be a rook in the direction of moving
				var rookPos = [
					move.to[0] > move.from[0] ? 7 : 0,
					move.to[1]];
				var rook = move.game.pieceAt(rookPos);
				if(rook != null && rook.constructor == ChessRook)
				{
					//And it must not have moved previously
					if(rook.lastPosition == undefined)
					{
						//The path between them must be clear
						if(move.game.isPathClear(this.position, rook.position))
						{
							//Move the rook to the space the king skips over
							var rookDest = [
								move.from[0] + (move.to[0] > move.from[0] ? 1 : -1),
								move.to[1]];
							move.moves.push({
								"piece": rook,
								"dest": rookDest
							});
							return true;
						}
					}
				}
			}
		}
		return false;
	};
}

ChessKing.name = "king";

if(typeof module != "undefined") {
	module.exports = ChessKing;
}
