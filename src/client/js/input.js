var lastMouseX;
var lastMouseY;
var mouseRB = false;

$(window).ready(function(){
	$("#glview").mousemove(function(event){

		var dx = event.pageX - (lastMouseX || event.pageX);
		var dy = event.pageY - (lastMouseY || event.pageY);
		lastMouseX = event.pageX;
		lastMouseY = event.pageY;

		if(mouseRB > 0)
		{
			cam.pan(-dx / 200);
			cam.tilt(-dy / 200);
		}
	});
	$("#glview").mousedown(function(event){
		switch(event.which)
		{
		case 3:
			mouseRB = true;
			break;
		}
	});
	$("#glview").mouseup(function(event){
		switch(event.which)
		{
		case 3:
			mouseRB = false;
			break;
		}
	});
	$("#glview").contextmenu(function(){
		return false;
	});
});
