var game;

$(window).ready(function()
{
	initGlContext();

	//Initial resize to be safe
	resizeCanvas();

	//Set up game state
	game = new ChessGame();

	//Start main draw loop
	draw(performance.now());

	//Init client and start connection
	initClient();
});

$(window).resize(function()
{
	resizeCanvas();
});
