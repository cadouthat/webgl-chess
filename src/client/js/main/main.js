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

	//Start main draw loop
	draw(performance.now());

	//Init client and start connection
	initClient();
});

$(window).resize(function()
{
	resizeCanvas();
});
