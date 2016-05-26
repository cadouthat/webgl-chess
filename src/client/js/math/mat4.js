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
	this.values[0 * 4 + 0] = 1;
	this.values[1 * 4 + 1] = 1;
	this.values[2 * 4 + 2] = 1;
	this.values[3 * 4 + 3] = 1;
	return this;
};
mat4.prototype.copyFrom = function(mat)
{
	this.values.set(mat.values);
	return this;
};
mat4.prototype.clone = function()
{
	var mat = new mat4();
	mat.copyFrom(this);
	return mat;
};
mat4.prototype.asArray = function()
{
	return this.values;
};
mat4.prototype.loadTranslate = function(vec)
{
	this.loadIdentity();
	this.values[3 * 4 + 0] = vec.x;
	this.values[3 * 4 + 1] = vec.y;
	this.values[3 * 4 + 2] = vec.z;
	return this;
};
mat4.prototype.loadScale = function(vec)
{
	this.loadIdentity();
	this.values[0 * 4 + 0] = vec.x;
	this.values[1 * 4 + 1] = vec.y;
	this.values[2 * 4 + 2] = vec.z;
	return this;
};
mat4.prototype.loadRotate = function(axis, radians)
{
	this.loadIdentity();
	if(radians == 0)
	{
		return this;
	}
	axis = axis.normalize();
	var x = axis.x;
	var y = axis.y;
	var z = axis.z;
	var c = Math.cos(radians);
	var s = Math.sin(radians);
	var t = 1 - c;
	this.values[0 * 4 + 0] = t * x * x + c;
	this.values[0 * 4 + 1] = t * x * y + s * z;
	this.values[0 * 4 + 2] = t * x * z - s * y;
	this.values[1 * 4 + 0] = t * x * y - s * z;
	this.values[1 * 4 + 1] = t * y * y + c;
	this.values[1 * 4 + 2] = t * y * z + s * x;
	this.values[2 * 4 + 0] = t * x * z + s * y;
	this.values[2 * 4 + 1] = t * y * z - s * x;
	this.values[2 * 4 + 2] = t * z * z + c;
	return this;
};
mat4.prototype.loadPerspective = function(fov, aspect, near, far)
{
	this.loadIdentity();
	var fd = near - far;
	var f = 1.0 / Math.tan(0.5 * fov);
	this.values[0 * 4 + 0] = f / aspect;
	this.values[1 * 4 + 1] = f;
	this.values[2 * 4 + 2] = (near + far) / fd;
	this.values[3 * 4 + 3] = 0;
	this.values[2 * 4 + 3] = -1;
	this.values[3 * 4 + 2] = (2.0 * far * near) / fd;
	return this;
};
mat4.prototype.loadLookAt = function(eye, center, up)
{
	this.loadIdentity();
	var z = center.sub(eye).normalize();
	var x = z.cross(up).normalize();
	var y = x.cross(z);
	this.values[0 * 4 + 0] = x.x;
	this.values[0 * 4 + 1] = y.x;
	this.values[0 * 4 + 2] = -z.x;
	this.values[0 * 4 + 3] = 0;
	this.values[1 * 4 + 0] = x.y;
	this.values[1 * 4 + 1] = y.y;
	this.values[1 * 4 + 2] = -z.y;
	this.values[1 * 4 + 3] = 0;
	this.values[2 * 4 + 0] = x.z;
	this.values[2 * 4 + 1] = y.z;
	this.values[2 * 4 + 2] = -z.z;
	this.values[2 * 4 + 3] = 0;
	this.values[3 * 4 + 0] = -eye.dot(x);
	this.values[3 * 4 + 1] = -eye.dot(y);
	this.values[3 * 4 + 2] = eye.dot(z);
	this.values[3 * 4 + 3] = 1;
	return this;
};
mat4.prototype.multiplyBy = function(mat)
{
	var tmp = this.values.slice();
	this.values[0] = tmp[0] * mat.values[0] + tmp[4] * mat.values[1] + tmp[8] * mat.values[2] + tmp[12] * mat.values[3];
	this.values[1] = tmp[1] * mat.values[0] + tmp[5] * mat.values[1] + tmp[9] * mat.values[2] + tmp[13] * mat.values[3];
	this.values[2] = tmp[2] * mat.values[0] + tmp[6] * mat.values[1] + tmp[10] * mat.values[2] + tmp[14] * mat.values[3];
	this.values[3] = tmp[3] * mat.values[0] + tmp[7] * mat.values[1] + tmp[11] * mat.values[2] + tmp[15] * mat.values[3];
	this.values[4] = tmp[0] * mat.values[4] + tmp[4] * mat.values[5] + tmp[8] * mat.values[6] + tmp[12] * mat.values[7];
	this.values[5] = tmp[1] * mat.values[4] + tmp[5] * mat.values[5] + tmp[9] * mat.values[6] + tmp[13] * mat.values[7];
	this.values[6] = tmp[2] * mat.values[4] + tmp[6] * mat.values[5] + tmp[10] * mat.values[6] + tmp[14] * mat.values[7];
	this.values[7] = tmp[3] * mat.values[4] + tmp[7] * mat.values[5] + tmp[11] * mat.values[6] + tmp[15] * mat.values[7];
	this.values[8] = tmp[0] * mat.values[8] + tmp[4] * mat.values[9] + tmp[8] * mat.values[10] + tmp[12] * mat.values[11];
	this.values[9] = tmp[1] * mat.values[8] + tmp[5] * mat.values[9] + tmp[9] * mat.values[10] + tmp[13] * mat.values[11];
	this.values[10] = tmp[2] * mat.values[8] + tmp[6] * mat.values[9] + tmp[10] * mat.values[10] + tmp[14] * mat.values[11];
	this.values[11] = tmp[3] * mat.values[8] + tmp[7] * mat.values[9] + tmp[11] * mat.values[10] + tmp[15] * mat.values[11];
	this.values[12] = tmp[0] * mat.values[12] + tmp[4] * mat.values[13] + tmp[8] * mat.values[14] + tmp[12] * mat.values[15];
	this.values[13] = tmp[1] * mat.values[12] + tmp[5] * mat.values[13] + tmp[9] * mat.values[14] + tmp[13] * mat.values[15];
	this.values[14] = tmp[2] * mat.values[12] + tmp[6] * mat.values[13] + tmp[10] * mat.values[14] + tmp[14] * mat.values[15];
	this.values[15] = tmp[3] * mat.values[12] + tmp[7] * mat.values[13] + tmp[11] * mat.values[14] + tmp[15] * mat.values[15];
	return this;
};
mat4.prototype.transform = function(vec, w)
{
	if(w === undefined) w = 1;
	var result = new vec3(this.values[0] * vec.x + this.values[4] * vec.y + this.values[8] * vec.z + this.values[12] * w,
		this.values[1] * vec.x + this.values[5] * vec.y + this.values[9] * vec.z + this.values[13] * w,
		this.values[2] * vec.x + this.values[6] * vec.y + this.values[10] * vec.z + this.values[14] * w);
	var resultW = this.values[3] * vec.x + this.values[7] * vec.y + this.values[11] * vec.z + this.values[15] * w;
	result.scaleIn(1 / resultW);
	return result;
};
mat4.prototype.inverse = function()
{
	var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3],
	a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7],
	a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11],
	a30 = this.values[12], a31 = this.values[13], a32 = this.values[14], a33 = this.values[15];

	var b00 = a00 * a11 - a01 * a10,
	b01 = a00 * a12 - a02 * a10,
	b02 = a00 * a13 - a03 * a10,
	b03 = a01 * a12 - a02 * a11,
	b04 = a01 * a13 - a03 * a11,
	b05 = a02 * a13 - a03 * a12,
	b06 = a20 * a31 - a21 * a30,
	b07 = a20 * a32 - a22 * a30,
	b08 = a20 * a33 - a23 * a30,
	b09 = a21 * a32 - a22 * a31,
	b10 = a21 * a33 - a23 * a31,
	b11 = a22 * a33 - a23 * a32;

	var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	if (!det) return null;

	det = 1.0 / det;

	var inv = new mat4();
	inv.values[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	inv.values[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	inv.values[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	inv.values[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
	inv.values[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	inv.values[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	inv.values[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	inv.values[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
	inv.values[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	inv.values[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	inv.values[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	inv.values[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
	inv.values[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	inv.values[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	inv.values[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	inv.values[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
	return inv;
};

//Static functions
mat4._getTemp = function()
{
	if(!this._temp)
	{
		this._temp = new mat4();
	}
	return this._temp;
};
mat4.translate = function(vec)
{
	return this._getTemp().loadTranslate(vec);
};
mat4.scale = function(vec)
{
	return this._getTemp().loadScale(vec);
};
mat4.rotate = function(axis, radians)
{
	return this._getTemp().loadRotate(axis, radians);
};
mat4.perspective = function(fov, aspect, near, far)
{
	return this._getTemp().loadPerspective(fov, aspect, near, far);
};
