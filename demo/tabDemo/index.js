define(
	["common/demoView", "bin/common/tabView"],
	function(Base, TabView)
	{
		var Class = {};

		Class.posGenHTML = function()
		{
			this._tabView = new TabView(
			{
				elem : this.$("#tabView"),
				items : ["0", "1", "2", "3"],
				current : "2",
				tabBarID : "tabBarView",
				swipeID : "swipeView",
				activeStyle:"TabDemoView-tab-item-active",
				deactiveStyle:"TabDemoView-tab-item-deactive",
				onChange:function(view, item)
				{
					bin.hudManager.showStatus(item+" tab");
				}
			});
		}

		return Base.extend(Class);
	} 
);