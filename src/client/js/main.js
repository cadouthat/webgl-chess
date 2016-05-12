var gl;

function init()
{
	var canvas = $("#glview")[0];

	gl = null;
	try
	{
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	}
	catch(e) {}

	if(!gl)
	{
		logError("Failed to get WebGL context.");
		return false;
	}

	gl.clearColor(0.5, 0.5, 0.5, 1.0);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	loadModels();

	buildShaders();

	return true;
}

$(document).ready(function()
{
	init();
	draw(performance.now());
});
