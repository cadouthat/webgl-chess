//Compile shader from source string and type
function compileShader(source, type)
{
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		logError("Shader compilation failed: " + gl.getShaderInfoLog(shader));
	}
	return shader;
}

//Create program from vertex and fragment shader
function linkShaders(vs, fs)
{
	var prog = gl.createProgram();
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);
	return prog;
}

//Enable a named attribute from the given program
function enableShaderAttrib(prog, name)
{
	var attribLoc = gl.getAttribLocation(prog, name);
	gl.enableVertexAttribArray(attribLoc);
	return attribLoc;
}

var ShaderInfo = function()
{
	this.program = null;
	this.attrib = {};
	this.uniform = {};
};

//Shader object prototypes
var main_shader = new ShaderInfo();
var blank_shader = new ShaderInfo();
var screen_shader = new ShaderInfo();

function buildShaders()
{
	//Compile and link programs
	shd_main_vs = compileShader(src_main_vs, gl.VERTEX_SHADER);
	shd_main_fs = compileShader(src_main_fs, gl.FRAGMENT_SHADER);
	main_shader.program = linkShaders(shd_main_vs, shd_main_fs);

	shd_blank_vs = compileShader(src_blank_vs, gl.VERTEX_SHADER);
	shd_blank_fs = compileShader(src_blank_fs, gl.FRAGMENT_SHADER);
	blank_shader.program = linkShaders(shd_blank_vs, shd_blank_fs);

	shd_screen_vs = compileShader(src_screen_vs, gl.VERTEX_SHADER);
	shd_screen_fs = compileShader(src_screen_fs, gl.FRAGMENT_SHADER);
	screen_shader.program = linkShaders(shd_screen_vs, shd_screen_fs);

	//Store attribute and uniform locations
	gl.useProgram(main_shader.program);
	main_shader.attrib.pos = enableShaderAttrib(main_shader.program, "pos");
	main_shader.attrib.norm = enableShaderAttrib(main_shader.program, "norm");
	main_shader.attrib.uv = enableShaderAttrib(main_shader.program, "uv");
	main_shader.uniform.mvp = gl.getUniformLocation(main_shader.program, "mvp");
	main_shader.uniform.model = gl.getUniformLocation(main_shader.program, "model");
	main_shader.uniform.eye = gl.getUniformLocation(main_shader.program, "eye");

	gl.useProgram(blank_shader.program);
	blank_shader.attrib.pos = enableShaderAttrib(blank_shader.program, "pos");
	blank_shader.uniform.mvp = gl.getUniformLocation(blank_shader.program, "mvp");
	blank_shader.uniform.model = gl.getUniformLocation(blank_shader.program, "model");

	gl.useProgram(screen_shader.program);
	screen_shader.attrib.pos = enableShaderAttrib(screen_shader.program, "pos");

	//Default to main shader
	gl.useProgram(main_shader.program);
}
