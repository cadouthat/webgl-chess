function Camera()
{
	//Speed factor for smoothing animations
	this._smoothRate = 4;

	//Cached matrix for lookAt calculations
	this._lookAt = mat4.create();
	//Cached eye position
	this._eye = vec3.create();
	//Distance from origin
	this._distance = 5;
	//Desired distance from origin (will be animated)
	this._targetDistance = this._distance;
	//Vertical rotation
	this._theta = 0;
	//Horizontal rotation
	this._phi = 0;
	//Track cached value staleness
	this._stale = true;

	this._update = function()
	{
		//Update cached values if stale
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

	this.animate = function(span)
	{
		//Distance animation
		if(this._targetDistance != this._distance)
		{
			var diffDistance = this._targetDistance - this._distance;
			//Movement amount based on time, distance, and smoothRate
			var incDistance = span * this._smoothRate * Math.max(this._distance, this._targetDistance);
			if(Math.abs(diffDistance) > incDistance)
			{
				if(diffDistance > 0)
				{
					this._distance += incDistance;
				}
				else
				{
					this._distance -= incDistance;
				}
			}
			else this._distance = this._targetDistance;
			this._stale = true;
		}
	};

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
		this._targetDistance *= factor;
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
