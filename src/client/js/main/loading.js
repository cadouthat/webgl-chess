var piece_models = {};

function loadModels()
{
	//Inflate models
	mdl_board = inflateModel(src_board);
	piece_models["king"] = inflateModel(src_king);
	piece_models["queen"] = inflateModel(src_queen);
	piece_models["bishop"] = inflateModel(src_bishop);
	piece_models["knight"] = inflateModel(src_knight);
	piece_models["rook"] = inflateModel(src_rook);
	piece_models["pawn"] = inflateModel(src_pawn);

	//Load textures
	tex_white_marble = loadTexture("white_marble");
	tex_black_marble = loadTexture("black_marble");
	tex_mixed_marble = loadTexture("mixed_marble");
}
