function space(str)
{
	var file = str.charCodeAt(0) - "A".charCodeAt(0);
	var rank = parseInt(str.substring(1)) - 1;
	return [file,rank];
}
