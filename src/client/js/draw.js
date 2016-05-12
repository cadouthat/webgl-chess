function draw(msTime)
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mvp.setView(cam.getLookAt());
	gl.uniformMatrix4fv(prog_test_mvp, false, mvp.getMvp());

	drawModel(mdl_triangle);

	update(msTime);

	window.requestAnimationFrame(draw);
}
