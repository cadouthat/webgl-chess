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
vec3.prototype.clone = function()
{
	return new vec3(this.x, this.y, this.z);
}
vec3.prototype.asArray = function()
{
	return [this.x, this.y, this.z];
};
vec3.prototype.len = function()
{
	return Math.sqrt(Math.pow(this.x, 2), Math.pow(this.y, 2), Math.pow(this.z, 2));
};
vec3.prototype.normalize = function()
{
	var result = new vec3();
	var len = this.len();
	if(len > 0)
	{
		result.x = this.x / len;
		result.y = this.y / len;
		result.z = this.z / len;
	}
	return result;
};
vec3.prototype.addIn = function(vec)
{
	this.x += vec.x;
	this.y += vec.y;
	this.z += vec.z;
	return this;
};
vec3.prototype.subIn = function(vec)
{
	this.x -= vec.x;
	this.y -= vec.y;
	this.z -= vec.z;
	return this;
};
vec3.prototype.scaleIn = function(scalar)
{
	this.x *= scalar;
	this.y *= scalar;
	this.z *= scalar;
	return this;
};
vec3.prototype.add = function(vec)
{
	return this.clone().addIn(vec);
};
vec3.prototype.sub = function(vec)
{
	return this.clone().subIn(vec);
};
vec3.prototype.scale = function(scalar)
{
	return this.clone().subIn(vec);
};
vec3.prototype.cross = function(vec)
{
	return new vec3(this.y * vec.z - this.z * vec.y,
		this.z * vec.x - this.x * vec.z,
		this.x * vec.y - this.y * vec.x);
};
vec3.prototype.dot = function(vec)
{
	return (this.x * vec.x) +
		(this.y * vec.y) +
		(this.z * vec.z);
};
vec3.prototype.angle = function(vec)
{
	var thisLen = this.len();
	if(thisLen == 0) return 0;
	var vecLen = vec.len();
	if(vecLen == 0) return 0;
	return Math.acos(this.dot(b) / thisLen / vecLen);
};
