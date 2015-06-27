define(
	["common/demoView", "bin/common/listView", "bin/core/view"],
	function(Base, ListView, View)
	{
		var Class = {};

		var ItemProvider = ListView.TemplateItemProvider.extend(
		{
			createItemView:function(listView, i, data)
			{
				var v = ListView.TemplateItemProvider.prototype.createItemView.call(this, listView, i, data);

				v.$("#itemContent").on("click", function()
				{
					bin.naviController.push("refreshListViewDemo/itemDetail", {id:i, data:data});
				});

				return v;
			}
		});

		Class.posGenHTML = function()
		{
			this._listView = new ListView({elem:this.$("#listView"), itemProvider:new ItemProvider({template:this.$html("#itemTemplate")}), dataProvider:new ListView.DataProvider({type:"demo"})});
		}

		return Base.extend(Class);
	}
);