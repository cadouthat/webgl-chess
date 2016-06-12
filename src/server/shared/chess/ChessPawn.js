function ChessPawn()
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
		var files = (move.to[0] - move.from[0]);
		var ranks = (move.to[1] - move.from[1]) * move.forward;
		//Cannot capture in front
		if(files == 0 && move.capture != null)
		{
			return false;
		}
		//Regular 1-rank moves
		if(ranks == 1)
		{
			//Can only move 0 or 1 files
			if(Math.abs(files) > 1)
			{
				return false;
			}
			//Check capture rules
			if(Math.abs(files) == 1)
			{
				//If there is a pawn behind the destination, check for en passant
				var target = move.game.pieceAt([move.to[0], move.to[1] - move.forward]);
				if(target != null && target.constructor == ChessPawn)
				{
					//The target must be the last thing moved
					if(move.game.lastMoved == target)
					{
						//The target must have moved through the destination
						if(move.game.equalSpaces(target.lastPosition, [move.to[0], move.to[1] + move.forward]))
						{
							move.capture = target;
						}
					}
				}
				//Must capture something
				if(move.capture == null)
				{
					return false;
				}
			}
			//Check for promotion (reaching either side of the board)
			if(move.to[1] == 0 || move.to[1] == 7)
			{
				move.promotion = this;
			}
			return true;
		}
		//Special 2-rank initial move
		if(ranks == 2 && files == 0)
		{
			//Must not have moved
			return (this.lastPosition == undefined);
		}
		return false;
	};
}

if(typeof module != "undefined") {
	module.exports = ChessPawn;
}
