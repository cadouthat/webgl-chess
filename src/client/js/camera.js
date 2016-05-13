function Camera()
{
	this._lookAt = mat4.create();
	this._eye = vec3.create();
	this._distance = 5;
	this._theta = 0;
	this._phi = 0;
	this._stale = true;

	this._update = function()
	{
		if(this._stale)
		{
			var origin = [0, 0, 0];
			var eye_start = vec3.fromValues(0, 0, this._distance);
			vec3.rotateX(this._eye, eye_start, origin, this._theta);
			vec3.rotateY(this._eye, this._eye, origin, this._phi);
			mat4.lookAt(this._lookAt, this._eye, origin, [0, 1, 0]);
			this._stale = false;
		}
	}

	this.getLookAt = function()
	{
		this._update();
		return this._lookAt;
	};

	this.getEye = function()
	{
		this._update();
		return this._eye;
	}

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
