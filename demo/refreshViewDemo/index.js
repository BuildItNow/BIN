define(
	["common/demoView", "refreshViewDemo/refreshView"],
	function(Base, RefreshView)
	{
		var Class = {};

		Class.posGenHTML = function()
		{
			this._refreshView = new RefreshView({el:this.$("#refreshView")[0]});
			this._refreshView.render();
		}

		return Base.extend(Class);
	}
);