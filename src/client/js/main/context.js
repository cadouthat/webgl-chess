//Static settings for rendering
var DEFAULT_FOV = 1.309; //75 degrees
var NEAR_DIST = 0.001;
var FAR_DIST = 1000;

var gl;
var mvp;
var cam;
var canvas;

function init()
{
	canvas = $("#glview")[0];

	//Get WebGL context
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

	//OpenGL settings
	gl.clearColor(0, 0, 0, 0);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	//Loading and building
	loadModels();
	buildShaders();

	//Initialize helper objects
	mvp = new MvpManager();
	cam = new Camera();

	return true;
}

function resize()
{
	//Resize canvas element (fill screen)
	canvas.width = $(document).width();
	canvas.height = $(document).height();

	//Resize viewport
	gl.viewport(0, 0, canvas.width, canvas.height);

	//Adjust perspective matrix
	mvp.setProjection(mat4.perspective(DEFAULT_FOV, canvas.width / canvas.height, NEAR_DIST, FAR_DIST));
}
