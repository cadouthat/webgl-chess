function loadModels()
{
	//Inflate models
	mdl_board = inflateModel(src_board);
	mdl_king = inflateModel(src_king);
	mdl_queen = inflateModel(src_queen);
	mdl_bishop = inflateModel(src_bishop);
	mdl_knight = inflateModel(src_knight);
	mdl_rook = inflateModel(src_rook);
	mdl_pawn = inflateModel(src_pawn);

	//Load textures
	tex_white_marble = loadTexture("white_marble");
	tex_black_marble = loadTexture("black_marble");
	tex_mixed_marble = loadTexture("mixed_marble");
}
