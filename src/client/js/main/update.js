var lastUpdateTime;

function update(msTime)
{
	var span = (msTime - (lastUpdateTime || msTime)) / 1000;
	lastUpdateTime = msTime;

	cam.animate(span);
}
