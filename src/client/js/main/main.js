var game;
var myColor;

$(window).ready(function()
{
	init();

	//Initial resize to be safe
	resize();

	//Set up game state
	game = new ChessGame();
	myColor = "white";

	//Start main draw loop
	draw(performance.now());
});

$(window).resize(function()
{
	resize();
});
