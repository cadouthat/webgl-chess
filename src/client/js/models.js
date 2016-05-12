function inflateModel(orig)
{
	var vertices = [];

	for(var i = 0; i < orig["draw"].length; i++)
	{
		var vi = i * 3;
		vertices.push(orig["vertices"][vi],
			orig["vertices"][vi + 1],
			orig["vertices"][vi + 2]);
	}

	var vbuf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	return {
		"vbuf": vbuf,
		"numVerts": orig["draw"].length
	};
}

function loadModels()
{
	mdl_triangle = inflateModel(src_mdl_triangle);
}

function drawModel(mdl)
{
	gl.bindBuffer(gl.ARRAY_BUFFER, mdl["vbuf"]);
	gl.drawArrays(gl.TRIANGLES, 0, mdl["numVerts"]);
}
