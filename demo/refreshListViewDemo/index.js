define(
	["common/demoView", "bin/common/listView", "bin/common/listDataProvider"],
	function(Base, ListView, ListDataProvider)
	{
		var Class = {};

		Class.posGenHTML = function()
		{
			this._listView = new ListView({elem:this.$("#listView"), itemProvider:"<div><%=label%></div>", dataProvider:new ListDataProvider({type:"hello"})});
		}

		return Base.extend(Class);
	}
);