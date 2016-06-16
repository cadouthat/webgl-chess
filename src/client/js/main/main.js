var game;
var client;

$(window).ready(function()
{
	initGlContext();

	//Initial resize to be safe
	resizeCanvas();

	//Set up game state
	game = new ChessGame();

	//Start main draw loop
	draw(performance.now());

	//Connect to server
	client = new ChessClient();
	//TEST
	client.myColor = "white";
	//TEST
});

$(window).resize(function()
{
	resizeCanvas();
});
