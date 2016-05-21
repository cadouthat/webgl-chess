function MvpManager()
{
	//Cached model-view-projection matrix
	this._mvp = new mat4();
	//Component matrices
	this._model = new mat4();
	this._view = new mat4();
	this._projection = new mat4();
	//Stack for model matrix history
	this._modelStack = [];
	//Track cached value staleness
	this._stale = true;

	this.setModel = function(mat)
	{
		this._model.copyFrom(mat);
		this._stale = true;
	};

	this.pushModel = function()
	{
		this._modelStack.push(this._model.clone());
	};

	this.multModel = function(mat)
	{
		this._model.multiplyBy(mat);
		this._stale = true;
	};

	this.popModel = function()
	{
		this._model.copyFrom(this._modelStack.pop());
		this._stale = true;
	};

	this.getModel = function()
	{
		return this._model;
	};

	this.setView = function(mat)
	{
		this._view.copyFrom(mat);
		this._stale = true;
	};

	this.getView = function()
	{
		return this._view;
	};

	this.setProjection = function(mat)
	{
		this._projection.copyFrom(mat);
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
			this._mvp.copyFrom(this._projection);
			this._mvp.multiplyBy(this._view);
			this._mvp.multiplyBy(this._model);
			this._stale = false;
		}
		return this._mvp;
	};
}
