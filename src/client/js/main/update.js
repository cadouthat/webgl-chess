var lastUpdateTime;

function update(msTime)
{
	//Calculate elapsed time in seconds
	var span = (msTime - (lastUpdateTime || msTime)) / 1000;
	lastUpdateTime = msTime;

	//Animate camera movement
	cam.animate(span);

	//Track and animate chess pieces
	renderer.update(span);
}
