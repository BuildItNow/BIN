define(
	["bin/core/naviPageView", "bin/common/tabView", "text!IOAnimCallbackDemo/callbackContent.html", "bin/util/osUtil"],
	function(Base, TabView, contentHtml, osUtil)
	{
		var Class = {};

		Class.posGenHTML = function()
		{
			var self = this;
			setTimeout(function()
			{
				self.$html(".bin-page-content", contentHtml);

				self._tabView = new TabView(
				{
					elem : self.$("#tabView"),
					items : ["0", "1", "2", "3"],
					current : "2",
					activeStyle:"TabDemoView-tab-item-active",
					deactiveStyle:"TabDemoView-tab-item-deactive",
					onChange:function(view, item)
					{
						bin.hudManager.showStatus(item+" tab");
					}
				});

				self._tabView2 = new TabView(
				{
					elem : self.$("#tabView2"),
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
			}, 150);
		}

		Class.onRemove = function()
		{
			this._tabView.remove();
			this._tabView2.remove();
		}


		return Base.extend(Class);
	} 
);