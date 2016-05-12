function draw(msTime)
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	drawModel(mdl_triangle);

	window.requestAnimationFrame(draw);
}
