define(
	["common/demoView", "bin/common/tabBarView"],
	function(Base, TabBarView)
	{
		var Class = {};

		Class.posGenHTML = function()
		{
			this._tabBarView = new TabBarView(
			{
				elem : this.$("#tabBar"),
				items : ["0", "1", "2", "3"],
				current : "2",
				activeStyle:"TabBarDemoView-tab-item-active",
				deactiveStyle:"TabBarDemoView-tab-item-deactive",
				onChange:function(view, item){bin.hudManager.showStatus(item+" tab");}
			});

			this._tabBarView1 = new TabBarView(
			{
				elem : this.$("#tabBar1"),
				items : ["0", "1", "2", "3"],
				current : "0",
				activeStyle:function(elem)
				{
					elem.removeClass("TabBarDemoView-tab-item-deactive");
					elem.addClass("TabBarDemoView-tab-item-active");
				},
				deactiveStyle:function(elem)
				{
					elem.removeClass("TabBarDemoView-tab-item-active");
					elem.addClass("TabBarDemoView-tab-item-deactive");
				},
				onChange:function(view, item){bin.hudManager.showStatus("bar1 "+item+" tab");}
			});
		}

		return Base.extend(Class);
	} 
);