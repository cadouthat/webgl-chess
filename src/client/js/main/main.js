$(window).ready(function()
{
	init();

	resize();

	draw(performance.now());
});

$(window).resize(function()
{
	resize();
});
