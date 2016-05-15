var lastUpdateTime;

function update(msTime)
{
	//Calculate elapsed time in seconds
	var span = (msTime - (lastUpdateTime || msTime)) / 1000;
	lastUpdateTime = msTime;

	//Animate camera movement
	cam.animate(span);
}
