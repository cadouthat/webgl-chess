DEFAULT_FOV = 1.5708; //90 degrees
NEAR_DIST = 0.001;
FAR_DIST = 1000;

var gl;
var mvp;
var cam;

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

	mvp = new MvpManager();
	cam = new Camera();

	return true;
}

function resize()
{
	var canvas = $("#glview")[0];
	canvas.width = $(document).width();
	canvas.height = $(document).height();
	gl.viewport(0, 0, canvas.width, canvas.height);

	var persp = mat4.create();
	mat4.perspective(persp, DEFAULT_FOV, canvas.width / canvas.height, NEAR_DIST, FAR_DIST);
	mvp.setProjection(persp);
}
