var game;
var myColor;

$(window).ready(function()
{
	initGlContext();

	//Initial resize to be safe
	resizeCanvas();

	//Set up game state
	game = new ChessGame();
	myColor = "white";

	//Start main draw loop
	draw(performance.now());
});

$(window).resize(function()
{
	resizeCanvas();
});
