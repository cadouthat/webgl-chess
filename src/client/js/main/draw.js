function draw(msTime)
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Update view and matrices
	mvp.setView(cam.getLookAt());
	gl.uniform3fv(main_shader.uniform.eye, cam.getEye());
	gl.uniformMatrix4fv(main_shader.uniform.mvp, false, mvp.getMvp());

	//Draw chess board
	gl.bindTexture(gl.TEXTURE_2D, tex_mixed_marble);
	drawModel(mdl_board);

	//Progress game time
	update(msTime);

	window.requestAnimationFrame(draw);
}
