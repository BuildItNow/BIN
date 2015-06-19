define(
	["common/demoView", "refreshListViewDemo/listView", "bin/util/osUtil"],
	function(Base, RefreshView, osUtil)
	{
		var Class = {};

		Class.posGenHTML = function()
		{
			this._refreshView = new RefreshView({elem:this.$("#refreshView"), onRefresh:function(){this._onRefresh()}.bind(this), onLoadMore:function(){this._onLoadMore()}.bind(this)});
		}

		Class._onRefresh = function()
		{
			var self = this;
			osUtil.delayCall(function()
			{
				var n = (Math.random()*30);
				var h = "";
				for(var i=0;i<n; ++i)
				{
					h += "<li>Pretty row"+i+"</li>";
				}
				self.$html("#list", h);
				
				self._refreshView.refreshDone();
			}, 1000);
		}

		Class._onLoadMore = function()
		{
			var self = this;
			osUtil.delayCall(function()
			{
				var n = (Math.random()*30);
				var h = "";
				for(var i=0;i<n; ++i)
				{
					h += "<li>Pretty row"+i+"</li>";
				}
				self.$append("#list", h);
				
				self._refreshView.loadMoreDone();
			}, 1000);			
		}

		return Base.extend(Class);
	}
);