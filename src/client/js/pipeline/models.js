//Create a usable model from the storage format
function inflateModel(orig)
{
	var numVerts = orig["draw"].length;
	var positions = [];
	var normals = [];

	//Loop over draw indices
	for(var i = 0; i < numVerts; i++)
	{
		//Expand original index for 3-value vectors
		var vi = orig["draw"][i] * 3;
		//Append raw position
		positions.push.apply(positions, orig["positions"].slice(vi, vi + 3));

		if("vert_normals" in orig)
		{
			//Append normal from vertex
			normals.push.apply(normals, orig["vert_normals"].slice(vi, vi + 3));
		}
		else if("face_normals" in orig)
		{
			//Face index is determined by position in draw array
			var fi = i - i % 3;
			//Append normal from face
			normals.push.apply(normals, orig["face_normals"].slice(fi, fi + 3));
		}
	}

	//Move arrays into OpenGL buffers
	var buf_positions = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf_positions);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	var buf_normals = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf_normals);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	var buf_uvs = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf_uvs);
	if("face_uvs" in orig)
	{
		//UV coords passed directly from storage
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(orig["face_uvs"]), gl.STATIC_DRAW);
	}
	else
	{
		//For now, create a blank UV array if not present
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(numVerts * 2), gl.STATIC_DRAW);
	}

	return {
		"positions": buf_positions,
		"normals": buf_normals,
		"uvs": buf_uvs,
		"numVerts": numVerts
	};
}

function loadTexture(id)
{
	//Create texture and populate blank image
	var tex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

	var img = new Image();
	img.onload = function(){
		//Once the image loads, populate actual data and mipmap
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		gl.generateMipmap(gl.TEXTURE_2D);
	};
	//Start image load
	img.src = "tex/" + id + ".png";

	return tex;
}

function drawModel(mdl)
{
	//Make sure the model matrix is up to date
	gl.uniformMatrix4fv(main_shader.uniform.model, false, mvp.getModel());

	//Bind and point to attribute arrays
	gl.bindBuffer(gl.ARRAY_BUFFER, mdl["positions"]);
	gl.vertexAttribPointer(main_shader.attrib.pos, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, mdl["normals"]);
	gl.vertexAttribPointer(main_shader.attrib.norm, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, mdl["uvs"]);
	gl.vertexAttribPointer(main_shader.attrib.uv, 2, gl.FLOAT, false, 0, 0);

	//Draw all vertices as triangles
	gl.drawArrays(gl.TRIANGLES, 0, mdl["numVerts"]);
}
