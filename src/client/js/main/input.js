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
			//Clear selection by default
			activeSpace = null;
			//New selection from hover
			if(hoverSpace)
			{
				var piece = game.pieceAt(hoverSpace);
				if(piece && piece.owner == myColor)
				{
					activeSpace = hoverSpace;
				}
			}
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
