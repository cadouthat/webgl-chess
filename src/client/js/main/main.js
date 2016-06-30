var game;
var renderer;

$(window).ready(function()
{
	initGlContext();

	//Initial resize to be safe
	resizeCanvas();

	//Set up game state and renderer
	game = new ChessGame();
	renderer = new ChessRenderer(game);

	//Init client and start connection
	initClient();

	//Start main draw loop
	draw(performance.now());
});

$(window).resize(function()
{
	resizeCanvas();
});
