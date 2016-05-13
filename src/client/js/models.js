function inflateModel(orig)
{
	var positions = [];
	var normals = [];

	for(var i = 0; i < orig["draw"].length; i++)
	{
		var vi = orig["draw"][i] * 3;
		positions.push(orig["positions"][vi],
			orig["positions"][vi + 1],
			orig["positions"][vi + 2]);
		normals.push(orig["normals"][vi],
			orig["normals"][vi + 1],
			orig["normals"][vi + 2]);
	}

	var buf_positions = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf_positions);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	var buf_normals = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf_normals);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	return {
		"positions": buf_positions,
		"normals": buf_normals,
		"numVerts": orig["draw"].length
	};
}

function loadModels()
{
	monkey = inflateModel(src_monkey);
}

function drawModel(mdl)
{
	gl.uniformMatrix4fv(main_shader.uniform.model, false, mvp.getModel());

	gl.bindBuffer(gl.ARRAY_BUFFER, mdl["positions"]);
	gl.vertexAttribPointer(main_shader.attrib.pos, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, mdl["normals"]);
	gl.vertexAttribPointer(main_shader.attrib.norm, 3, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLES, 0, mdl["numVerts"]);
}
