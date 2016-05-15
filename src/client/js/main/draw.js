function draw(msTime)
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Update view and matrices
	mvp.setView(cam.getLookAt());
	gl.uniform3fv(main_shader.uniform.eye, cam.getEye());
	gl.uniformMatrix4fv(main_shader.uniform.mvp, false, mvp.getMvp());

	//Draw test model
	gl.bindTexture(gl.TEXTURE_2D, tex_white_marble);
	drawModel(mdl_queen);

	//Progress game time
	update(msTime);

	window.requestAnimationFrame(draw);
}
