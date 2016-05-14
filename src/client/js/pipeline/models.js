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

function loadTexture(id)
{
	var img = new Image();
	var tex = gl.createTexture();
	img.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
	};
	img.src = "tex/" + id + ".png";
	return tex;
}

function loadModels()
{
	mdl_monkey = inflateModel(src_monkey);
	mdl_cube = inflateModel(src_cube);
	tex_white_marble = loadTexture("white_marble");
	gl.bindTexture(gl.TEXTURE_2D, tex_white_marble);
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
