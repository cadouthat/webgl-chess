function Camera()
{
	this._lookAt = mat4.create();
	this._distance = 5;
	this._theta = 0;
	this._phi = 0;
	this._stale = true;

	this.getLookAt = function()
	{
		if(this._stale)
		{
			var origin = [0, 0, 0];
			var eye = [0, 0, this._distance];
			vec3.rotateX(eye, eye, origin, this._theta);
			vec3.rotateY(eye, eye, origin, this._phi);
			mat4.lookAt(this._lookAt, eye, origin, [0, 1, 0]);
			this._stale = false;
		}
		return this._lookAt;
	};

	this.zoom = function(factor)
	{
		this._distance *= factor;
		this._stale = true;
	};

	this.pan = function(d)
	{
		this._phi += d;
		this._stale = true;
	};

	this.tilt = function(d)
	{
		this._theta += d;
		this._theta = Math.min(this._theta, Math.PI / 2);
		this._theta = Math.max(this._theta, -Math.PI / 2);
		this._stale = true;
	};
}
