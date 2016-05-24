//Transform screen coords into world coords
function unProject(screenX, screenY, screenZ, matrix, viewport)
{
	//Default depth to midpoint
	if(screenZ == undefined) screenZ = 0.5;

	//Default matrix/viewport to current rendering states
	if(matrix == undefined) matrix = mvp.getMvp();
	if(viewport == undefined) viewport = gl.getParameter(gl.VIEWPORT);

	//Invert projection/view matrix
	var inv = matrix.inverse();
	if(!inv)
	{
		return null;
	}

	//Convert screen to normalized coords
	var ndc = new vec3();
	ndc.x = 2 * (screenX - viewport[0]) / viewport[2] - 1;
	ndc.y = 2 * (viewport[1] - screenY) / viewport[3] + 1;
	ndc.z = screenZ;

	//Transform by inverted matrix
	return inv.transform(ndc);
}
