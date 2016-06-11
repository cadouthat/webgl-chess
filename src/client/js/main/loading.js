function loadModels()
{
	//Inflate models
	mdl_board = inflateModel(src_board);
	ChessKing.model = inflateModel(src_king);
	ChessQueen.model = inflateModel(src_queen);
	ChessBishop.model = inflateModel(src_bishop);
	ChessKnight.model = inflateModel(src_knight);
	ChessRook.model = inflateModel(src_rook);
	ChessPawn.model = inflateModel(src_pawn);

	//Load textures
	tex_white_marble = loadTexture("white_marble");
	tex_black_marble = loadTexture("black_marble");
}
