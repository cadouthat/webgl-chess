var lastMouseX;
var lastMouseY;
var mouseRB = false;

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
	$(document).keydown(function(event){

		if(!event.key)
		{
			switch(event.keyCode)
			{
			case 27:
				event.key = "Escape";
				break;
			}
		}

		switch(event.key)
		{
		case "Escape":
			if(activeSpace)
			{
				activeSpace = null;
				updateHover();
			}
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
				var promoteTo = null;
				if(pendingMove.promotion)
				{
					//TODO - prompt for promotion
					//TEST
					promoteTo = "queen";
					//TEST
				}
				//Execute highlighted move
				if(game.doMove(pendingMove.from, pendingMove.to, promoteTo))
				{
					//Notify the server
					client.move(pendingMove.from,
						pendingMove.to,
						pendingMove.promotion ? pendingMove.promoteTo.pieceName : null);
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
