//Represents a player's chess piece
function ChessPiece(owner, type, position)
{
	this.owner = owner;
	this.type = type;
	this.position = position;
}

if(typeof module != "undefined") {
	module.exports = ChessPiece;
}
