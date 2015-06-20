define(
	["common/demoView", "refreshListViewDemo/listView", "bin/util/osUtil"],
	function(Base, RefreshView, osUtil)
	{
		var Class = {};

		Class.posGenHTML = function()
		{
			this._listView = new RefreshView({elem:this.$("#listView")});
		}

		return Base.extend(Class);
	}
);