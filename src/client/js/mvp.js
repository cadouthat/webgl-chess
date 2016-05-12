function MvpManager()
{
	this._mvp = mat4.create();
	this.model = mat4.create();
	this.view = mat4.create();
	this.projection = mat4.create();
	this._stale = true;

	this.setModel = function(mat)
	{
		mat4.copy(this.model, mat);
		this._stale = true;
	};

	this.setView = function(mat)
	{
		mat4.copy(this.view, mat);
		this._stale = true;
	};

	this.setProjection = function(mat)
	{
		mat4.copy(this.projection, mat);
		this._stale = true;
	};

	this.getMvp = function()
	{
		if(this._stale)
		{
			mat4.multiply(this._mvp, this.projection, this.view);
			mat4.multiply(this._mvp, this._mvp, this.model);
			this._stale = false;
		}
		return this._mvp;
	};
}
