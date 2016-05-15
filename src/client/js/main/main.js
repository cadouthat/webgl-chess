$(window).ready(function()
{
	init();

	//Initial resize to be safe
	resize();

	//Start main draw loop
	draw(performance.now());
});

$(window).resize(function()
{
	resize();
});
