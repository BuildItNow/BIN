define(
	["bin/core/naviPageView", "bin/common/tabView", "text!IOAnimCallbackDemo/callbackContent.html", "bin/util/osUtil"],
	function(Base, TabView, contentHtml, osUtil)
	{
		var Class = {};

		Class.posGenHTML = function()
		{
			this._contentFragment = this.$fragment(".bin-page-content");
			this._contentFragment.append(contentHtml);
		}

		Class.onInAnimationBeg = function()
		{
			this._indicatorID = bin.hudManager.startIndicator({model:true});
		}

		Class.onInAnimationEnd = function()
		{
			bin.hudManager.stopIndicator(this._indicatorID);
			
			this._contentFragment.setup();
			this.createTabView();
			//})
		}

		Class.createTabView = function()
		{
			this._tabView = new TabView(
			{
				elem : this.$("#tabView"),
				items : ["0", "1", "2", "3"],
				current : "0",
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
				current : "2",
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

		Class.onRemove = function()
		{
			this._tabView.remove();
			this._tabView2.remove();
		}

		return Base.extend(Class);
	} 
);