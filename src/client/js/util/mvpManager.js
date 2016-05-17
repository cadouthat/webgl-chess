function MvpManager()
{
	//Cached model-view-projection matrix
	this._mvp = mat4.create();
	//Component matrices
	this._model = mat4.create();
	this._view = mat4.create();
	this._projection = mat4.create();
	//Stack for model matrix history
	this._modelStack = [];
	//Track cached value staleness
	this._stale = true;

	this.setModel = function(mat)
	{
		mat4.copy(this._model, mat);
		this._stale = true;
	};

	this.pushModel = function()
	{
		this._modelStack.push(mat4.clone(this._model));
	};

	this.popModel = function()
	{
		mat4.copy(this._model, this._modelStack.pop());
		this._stale = true;
	};

	this.getModel = function()
	{
		return this._model;
	};

	//Signals that the returned matrix will be modified in-place
	this.getMutableModel = function()
	{
		this._stale = true;
		return this.getModel();
	};

	this.setView = function(mat)
	{
		mat4.copy(this._view, mat);
		this._stale = true;
	};

	this.getView = function()
	{
		return this._view;
	};

	this.setProjection = function(mat)
	{
		mat4.copy(this._projection, mat);
		this._stale = true;
	};

	this.getProjection = function()
	{
		return this._projection;
	};

	this.getMvp = function()
	{
		//Update cached value if stale
		if(this._stale)
		{
			mat4.multiply(this._mvp, this._projection, this._view);
			mat4.multiply(this._mvp, this._mvp, this._model);
			this._stale = false;
		}
		return this._mvp;
	};
}
