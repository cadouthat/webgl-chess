var lastMouseX;
var lastMouseY;
var mouseRB = false;
var pendingPromotionMove = null;
var promotionDisplayPiece = null;
var promotionChoiceInd = 0;

function getKeyName(event)
{
	if(!event.key)
	{
		switch(event.keyCode)
		{
		case 27:
			event.key = "Escape";
			break;
		case 13:
			event.key = "Enter";
			break;
		}
	}
	return event;
}

function updatePromotionChoice()
{
	//Display selected model
	var choiceList = [ChessQueen, ChessBishop, ChessKnight, ChessRook];

	while(promotionChoiceInd < 0) promotionChoiceInd += choiceList.length;
	while(promotionChoiceInd >= choiceList.length) promotionChoiceInd -= choiceList.length;
	promotionDisplayPiece.promotionType = choiceList[promotionChoiceInd];
}
function promotionPrev()
{
	promotionChoiceInd--;
	updatePromotionChoice();
}
function promotionNext()
{
	promotionChoiceInd++;
	updatePromotionChoice();
}
function promotionConfirm()
{
	var promoteTo = promotionDisplayPiece.promotionType.pieceName;
	if(game.doMove(pendingPromotionMove.from, pendingPromotionMove.to, promoteTo))
	{
		//Notify the server
		client.move(pendingPromotionMove.from,
			pendingPromotionMove.to,
			promoteTo);
	}
	//Deactivate promotion mode
	pendingPromotionMove = null;
	promotionDisplayPiece.promotionType = null;
	promotionDisplayPiece.overridePosition = null;
	promotionDisplayPiece = null;
	hidePromotionSelector();
	updateHover();
}

$(window).ready(function(){
	$("#glview").mousemove(function(event){

		var dx = event.pageX - (lastMouseX || event.pageX);
		var dy = event.pageY - (lastMouseY || event.pageY);
		lastMouseX = event.pageX;
		lastMouseY = event.pageY;

		if(mouseRB)
		{
			cam.pan(-dx / 200);
			cam.tilt(-dy / 200);
		}

		updateHover();
	});
	$("#chat_entry").keydown(function(event){

		getKeyName(event);

		switch(event.key)
		{
		case "Escape":
			$(this).val("");
			$(this).blur();
			return false;

		case "Enter":
			if($(this).val().length)
			{
				client.chat($(this).val());
			}
			$(this).val("");
			$(this).blur();
			return false;
		}
	});
	$(document).keydown(function(event){

		getKeyName(event);

		switch(event.key)
		{
		case "Escape":
			if(activeSpace)
			{
				activeSpace = null;
				updateHover();
			}
			break;
		case "Enter":
			$("#chat_entry").focus();
			break;
		}
	});
	$(document).mousedown(function(event){

		switch(event.which)
		{
		case 3:
			mouseRB = true;
			break;
		}

		return false;
	});
	$(document).mouseup(function(event){

		switch(event.which)
		{
		case 1:
			if(pendingMove)
			{
				playSound(move_mp3);
				if(pendingMove.promotion)
				{
					//Begin promotion selection
					pendingPromotionMove = pendingMove;
					promotionDisplayPiece = renderer.pieceAt(pendingMove.from);
					promotionChoiceInd = 0;
					promotionDisplayPiece.overridePosition = pendingMove.to;
					updatePromotionChoice();
					showPromotionSelector();
					client.update(client);
				}
				else
				{
					//Execute highlighted move
					if(game.doMove(pendingMove.from, pendingMove.to))
					{
						//Notify the server
						client.move(pendingMove.from, pendingMove.to);
					}
				}
				activeSpace = null;
			}
			else if(hoverSpace && !game.equalSpaces(hoverSpace, activeSpace))
			{
				//New selection from hover
				var piece = game.pieceAt(hoverSpace);
				if(piece && piece.owner == client.myColor)
				{
					activeSpace = hoverSpace;
				}
			}
			else activeSpace = null;

			updateHover();
			break;

		case 3:
			mouseRB = false;
			break;
		}
		
		return false;
	});
	$(document).contextmenu(function(){

		return false;
	});
	$(document).bind("mousewheel DOMMouseScroll", function(event){

		if(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0)
		{
			cam.zoom(0.9);
		}
		else
		{
			cam.zoom(1.1);
		}

		updateHover();

		return false;
	});
});
