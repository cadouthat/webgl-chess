function Camera()
{
	//Speed factor for smoothing animations
	this._smoothRate = 4;

	//Cached matrix for lookAt calculations
	this._lookAt = new mat4();
	//Cached eye position
	this._eye = new vec3();
	//Distance from origin
	this._distance = 10;
	//Desired distance from origin (will be animated)
	this._targetDistance = this._distance;
	//Vertical rotation
	this._theta = -Math.PI / 6;
	//Horizontal rotation
	this._phi = Math.PI / 2;
	//Track cached value staleness
	this._stale = true;

	this._update = function()
	{
		//Update cached values if stale
		if(this._stale)
		{
			var origin = new vec3(0, 0, 0);
			var xAxis = new vec3(1, 0, 0);
			var yAxis = new vec3(0, 1, 0);
			var eye_start = new vec3(0, 0, this._distance);
			this._eye = mat4.rotate(xAxis, this._theta).transform(eye_start);
			this._eye = mat4.rotate(yAxis, this._phi).transform(this._eye);
			this._lookAt.loadLookAt(this._eye, origin, yAxis);
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
		this._targetDistance = Math.min(this._targetDistance, 25);
		this._targetDistance = Math.max(this._targetDistance, 1);
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
		this._theta = Math.min(this._theta, -Math.PI / 32);
		this._theta = Math.max(this._theta, -Math.PI / 2);
		this._stale = true;
	};
}
