var glowFb = null;
var glowTex = null;
var glowSwapTex = null;

function draw(msTime)
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Update view
	mvp.setView(cam.getLookAt());
	gl.uniform3fv(main_shader.uniform.eye, cam.getEye().asArray());

	//Draw chess board
	drawBoard();

	var glowPiece = hoverSpace ? game.pieceAt(hoverSpace) : null;
	if(glowPiece)
	{
		//Compute piece distances from camera
		for(var i = 0; i < game.pieces.length; i++)
		{
			game.pieces[i].viewDistance = game.pieces[i].getWorldPosition().sub(cam.getEye()).len();
		}

		//Draw pieces behind glow
		drawPieces(function(x){ return x.viewDistance > glowPiece.viewDistance; });

		drawPieceGlow(glowPiece);

		//Draw pieces in front of glow
		drawPieces(function(x){ return x.viewDistance <= glowPiece.viewDistance; });
	}
	else
	{
		drawPieces();
	}

	//Progress game time
	update(msTime);

	window.requestAnimationFrame(draw);
}

function drawPieces(filter)
{
	if(!filter) filter = function() { return true; };

	//Draw white chess pieces
	gl.bindTexture(gl.TEXTURE_2D, tex_white_marble);
	for(var i = 0; i < game.pieces.length; i++)
	{
		if(game.pieces[i].owner == "white" && filter(game.pieces[i]))
		{
			drawPiece(game.pieces[i]);
		}
	}

	//Draw black chess pieces
	gl.bindTexture(gl.TEXTURE_2D, tex_black_marble);
	for(var i = 0; i < game.pieces.length; i++)
	{
		if(game.pieces[i].owner == "black" && filter(game.pieces[i]))
		{
			drawPiece(game.pieces[i]);
		}
	}
}

function drawPieceGlow(piece)
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
		//Initialize textures to store frame colors
		glowTex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, glowTex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, glowFb.width, glowFb.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		glowSwapTex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, glowSwapTex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, glowFb.width, glowFb.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, glowSwapTex, 0);
	}
	else
	{
		//Bind the previously created framebuffer
		gl.bindFramebuffer(gl.FRAMEBUFFER, glowFb);
	}
	//Draw to framebuffer
	gl.viewport(0, 0, glowFb.width, glowFb.height);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, glowTex, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	//Draw as flat white
	gl.disable(gl.DEPTH_TEST);
	gl.useProgram(blank_shader.program);
	//Render piece slightly larger than normal
	drawPiece(piece, blank_shader);
	//Swap framebuffer textures
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, glowSwapTex, 0);
	gl.bindTexture(gl.TEXTURE_2D, glowTex);
	//Blur X
	gl.useProgram(blur_shader.program);
	gl.uniform3fv(blur_shader.uniform.color, new vec3(0.412, 0.98, 0.427).scaleIn(2).asArray());
	gl.uniform1i(blur_shader.uniform.blurDirection, 0);
	gl.uniform2fv(blur_shader.uniform.texSize, new Float32Array([glowFb.width, glowFb.height]));
	drawScreenOverlay();
	//Unbind framebuffer
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, canvas.width, canvas.height);
	//Blur Y and blend onto screen
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.uniform1i(blur_shader.uniform.blurDirection, 1);
	gl.bindTexture(gl.TEXTURE_2D, glowSwapTex);
	drawScreenOverlay();
	//Restore normal drawing mode
	gl.disable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);
	gl.useProgram(main_shader.program);
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
	//Translate to final position
	mvp.pushModel();
	mvp.multModel(mat4.translate(piece.getWorldPosition()));

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
