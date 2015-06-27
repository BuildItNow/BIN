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
				activeStyle:"TabDemoView-tab-item-active",
				deactiveStyle:"TabDemoView-tab-item-deactive",
				onChange:function(view, item)
				{
					bin.hudManager.showStatus(item+" tab");
				}
			});

			var self = this;
			this._tabView2 = new TabView(
			{
				elem : this.$("#tabView2"),
				items : ["0", "1", "2", "3"],
				current : "0",
				tabBarID : "tabBarView",
				swipeID : "swipeView",
				activeStyle:"TabDemoView-tab-item-active",
				deactiveStyle:"TabDemoView-tab-item-deactive",
				onChange:function(view, item)
				{
					view.$html("#label", "Welcome to "+item);
				}
			});
		}

		return Base.extend(Class);
	} 
);