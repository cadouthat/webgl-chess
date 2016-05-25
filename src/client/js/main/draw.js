var glowFb = null;
var glowTex = null;

function draw(msTime)
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Update view
	mvp.setView(cam.getLookAt());
	gl.uniform3fv(main_shader.uniform.eye, cam.getEye().asArray());

	//Draw chess board
	drawBoard();

	//Draw white chess pieces
	gl.bindTexture(gl.TEXTURE_2D, tex_white_marble);
	for(var i = 0; i < game.pieces.length; i++)
	{
		if(game.pieces[i].owner == "white")
		{
			drawPiece(game.pieces[i]);
		}
	}

	//Draw black chess pieces
	gl.bindTexture(gl.TEXTURE_2D, tex_black_marble);
	for(var i = 0; i < game.pieces.length; i++)
	{
		if(game.pieces[i].owner == "black")
		{
			drawPiece(game.pieces[i]);
		}
	}

	var glowPiece = hoverSpace ? game.pieceAt(hoverSpace) : null;
	if(glowPiece)
	{
		//Initialize and bind framebuffer
		if(glowFb == null)
		{
			//Initialize the framebuffer
			glowFb = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, glowFb);
			//Fixed width/height is sufficient for a glow effect
			glowFb.width = 512;
			glowFb.height = 512;
			//Initialize texture to store frame colors
			glowTex = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, glowTex);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, glowFb.width, glowFb.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, glowTex, 0);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
		else
		{
			//Bind the previously created framebuffer
			gl.bindFramebuffer(gl.FRAMEBUFFER, glowFb);
		}
		//Switch to framebuffer viewport
		gl.viewport(0, 0, glowFb.width, glowFb.height);
		//Draw as flat white
		gl.disable(gl.DEPTH_TEST);
		gl.useProgram(blank_shader.program);
		//Render piece to framebuffer
		drawPiece(glowPiece, blank_shader);
		//Unbind framebuffer
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, canvas.width, canvas.height);
		//Render texture to screen with blending
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.useProgram(screen_shader.program);
		gl.bindTexture(gl.TEXTURE_2D, glowTex);
		drawScreenOverlay();
		//Clear the framebuffer
		gl.bindFramebuffer(gl.FRAMEBUFFER, glowFb);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		//Restore normal drawing mode
		gl.disable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);
		gl.useProgram(main_shader.program);
	}

	//Progress game time
	update(msTime);

	window.requestAnimationFrame(draw);
}

//Draws a texture over the entire screen
function drawScreenOverlay()
{
	if(!drawScreenOverlay.buf)
	{
		//Initialize buffer data for corners
		drawScreenOverlay.buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, drawScreenOverlay.buf);
		gl.bufferData(gl.ARRAY_BUFFER,
			new Float32Array([
				-1, -1,
				-1, 1,
				1, -1,
				1, 1 ]),
			gl.STATIC_DRAW);
	}

	//Bind the data and draw two triangles
	gl.bindBuffer(gl.ARRAY_BUFFER, drawScreenOverlay.buf);
	gl.vertexAttribPointer(screen_shader.attrib.pos, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

var BOARD_SCALE = 5.82;

function drawBoard()
{
	//Bind board texture
	gl.bindTexture(gl.TEXTURE_2D, tex_mixed_marble);

	//Each segment is 2 spaces wide
	var sectWidth = 2 * BOARD_SCALE * 2 / BOARD_ROW_COUNT;
	var pos = new vec3();
	for(var ix = 0; ix < BOARD_ROW_COUNT / 2; ix++)
	{
		pos.x = ix * sectWidth - BOARD_SCALE;
		for(var iy = 0; iy < BOARD_ROW_COUNT / 2; iy++)
		{
			pos.z = iy * sectWidth - BOARD_SCALE;
			//Translate and draw segment
			mvp.pushModel();
			mvp.multModel(mat4.translate(pos));
			drawModel(mdl_board);
			mvp.popModel();
		}
	}
}

//Draw a specific chess piece
function drawPiece(piece, shader)
{
	//Get piece position
	var npos = piece.getNormalizedPosition();
	var pos3 = new vec3(npos[0] * BOARD_SCALE, 0, npos[1] * BOARD_SCALE);

	//Translate to final position
	mvp.pushModel();
	mvp.multModel(mat4.translate(pos3));

	//Black pieces need to be flipped around
	if(piece.owner == "black")
	{
		mvp.multModel(mat4.rotate(new vec3(0, 1, 0), Math.PI));
	}

	//Draw the piece model for this type
	drawModel(piece_models[piece.type], shader);

	//Restore model matrix
	mvp.popModel();
}
