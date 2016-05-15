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

//Shader object prototypes
var main_shader = {
	"program": null,
	"attrib": {},
	"uniform": {}
};

function buildShaders()
{
	//Compile and link programs
	shd_main_vs = compileShader(src_main_vs, gl.VERTEX_SHADER);
	shd_main_fs = compileShader(src_main_fs, gl.FRAGMENT_SHADER);
	main_shader.program = linkShaders(shd_main_vs, shd_main_fs);

	//Store attribute and uniform locations
	gl.useProgram(main_shader.program);
	main_shader.attrib.pos = enableShaderAttrib(main_shader.program, "pos");
	main_shader.attrib.norm = enableShaderAttrib(main_shader.program, "norm");
	main_shader.attrib.uv = enableShaderAttrib(main_shader.program, "uv");
	main_shader.uniform.mvp = gl.getUniformLocation(main_shader.program, "mvp");
	main_shader.uniform.model = gl.getUniformLocation(main_shader.program, "model");
	main_shader.uniform.eye = gl.getUniformLocation(main_shader.program, "eye");
}
