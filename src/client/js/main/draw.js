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

	//Progress game time
	update(msTime);

	window.requestAnimationFrame(draw);
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
function drawPiece(piece)
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
	drawModel(piece_models[piece.type]);

	//Restore model matrix
	mvp.popModel();
}
