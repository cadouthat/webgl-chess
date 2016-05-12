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

function linkShaders(vs, fs)
{
	var prog = gl.createProgram();
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);
	return prog;
}

var prog_test = null;

function buildShaders()
{
	shd_test_vs = compileShader(src_test_vs, gl.VERTEX_SHADER);
	shd_test_fs = compileShader(src_test_fs, gl.FRAGMENT_SHADER);
	prog_test = linkShaders(shd_test_vs, shd_test_fs);

	var posAttrib = gl.getAttribLocation(prog_test, "pos");
	gl.enableVertexAttribArray(posAttrib);
	gl.useProgram(prog_test);
	gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
}
