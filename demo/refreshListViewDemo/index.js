define(
	["common/demoView", "refreshListViewDemo/listView", "refreshListViewDemo/listDataProvider"],
	function(Base, ListView, ListDataProvider)
	{
		var Class = {};

		Class.posGenHTML = function()
		{
			this._listView = new ListView({elem:this.$("#listView"), dataProvider:new ListDataProvider({type:"hello", pageSize:5})});
		}

		return Base.extend(Class);
	}
);