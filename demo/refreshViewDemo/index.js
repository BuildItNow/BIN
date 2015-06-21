define(
	["common/demoView", "bin/common/refreshView", "bin/util/osUtil", "text!refreshViewDemo/view0.html", "text!refreshViewDemo/view1.html"],
	function(Base, RefreshView, osUtil, view0Html, view1Html)
	{
		var Class = {};

		Class.posGenHTML = function()
		{
			this._refreshView = new RefreshView({elem:this.$("#refreshView"), onRefresh:function(){this._onRefresh()}.bind(this)});
		}

		Class._onRefresh = function()
		{
			var self = this;
			osUtil.delayCall(function()
			{
				if(Math.random() > 0.5)
				{
					self.$html("#refreshContent", view0Html);
				}
				else
				{
					self.$html("#refreshContent", view1Html);
					self.$("#clickMe").on("click", function(){self.goBack()});
				}
				
				self._refreshView.refreshDone();
			}, 1000);
		}

		Class.asyncPosGenHTML = function()
		{
			this._refreshView.refresh(true);
		}

		return Base.extend(Class);
	}
);