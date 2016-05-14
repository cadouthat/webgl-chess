function inflateModel(orig)
{
	var positions = [];
	var normals = [];

	for(var i = 0; i < orig["draw"].length; i++)
	{
		var vi = orig["draw"][i] * 3;
		positions.push.apply(positions, orig["positions"].slice(vi, vi + 3));
		if("vert_normals" in orig)
		{
			normals.push.apply(normals, orig["vert_normals"].slice(vi, vi + 3));
		}
		else if("face_normals" in orig)
		{
			var fi = i - i % 3;
			normals.push.apply(normals, orig["face_normals"].slice(fi, fi + 3));
		}
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
	cube = inflateModel(src_cube);
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
