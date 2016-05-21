//Stores a 4x4 matrix as a float array
var mat4 = function()
{
	//Allocate value array
	this.values = new Float32Array(16);
	//Initialize to identity
	this.loadIdentity();
};

//Instance functions
mat4.prototype.loadIdentity = function()
{
	this.values.fill(0);
	this.values[0] = 1;
	this.values[5] = 1;
	this.values[10] = 1;
	this.values[15] = 1;
	return this;
};
mat4.prototype.loadTranslate = function(vec)
{
	//
	return this;
};
mat4.prototype.loadRotate = function(axis, radians)
{
	//
	return this;
};
mat4.prototype.loadPerspective = function(fov, aspect, near, far)
{
	//
	return this;
};
mat4.prototype.loadLookAt = function(center, eye, up)
{
	//
	return this;
};
mat4.prototype.copyFrom = function(mat)
{
	mat4.prototype.values.set(mat.values);
	return this;
};
mat4.prototype.clone = function()
{
	var mat = new mat4();
	mat.copyFrom(this);
	return mat;
};
mat4.prototype.multiplyBy = function(mat)
{
	//
	return this;
};
mat4.prototype.transform = function(vec)
{
	//
};

//Static functions
mat4._getTemp = function()
{
	if(!this._temp)
	{
		this._temp = new mat4();
	}
	return this._temp;
}
mat4.translate = function(vec)
{
	return this._getTemp().loadTranslate(vec);
};
mat4.rotate = function(axis, radians)
{
	return this._getTemp().loadRotate(axis, radians);
};
mat4.perspective = function(fov, aspect, near, far)
{
	return this._getTemp().loadPerspective(fov, aspect, near, far);
};
