//Stores a vector with xyz components
var vec3 = function()
{
	switch(arguments.length)
	{
	case 1:
		this.x = arguments[0];
		this.y = arguments[0];
		this.z = arguments[0];
		break;
	case 3:
		this.x = arguments[0];
		this.y = arguments[1];
		this.z = arguments[2];
		break;
	default:
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
};

//Instance functions
vec3.prototype.asArray = function()
{
	//
};
vec3.prototype.len = function()
{
	//
};
vec3.prototype.normalize = function()
{
	//
};
vec3.prototype.addIn = function(vec)
{
	//
	return this;
};
vec3.prototype.add = function(vec)
{
	//
};
vec3.prototype.sub = function(vec)
{
	//
};
vec3.prototype.dot = function(vec)
{
	//
};
vec3.prototype.angle = function(vec)
{
	//
};
vec3.prototype.cross = function(vec)
{
	//
};
vec3.prototype.scale = function(scalar)
{
	//
};
