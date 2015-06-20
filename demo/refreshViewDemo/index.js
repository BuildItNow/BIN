define(
	["common/demoView", "bin/common/refreshView", "bin/util/osUtil"],
	function(Base, RefreshView, osUtil)
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
				var n = (Math.random()*30);
				var h = "";
				for(var i=0;i<n; ++i)
				{
					h += "<li>Pretty row"+i+"</li>";
				}
				self.$html("#list", h);
				
				self._refreshView.refreshDone();
			}, 2000);
		}

		Class.asyncPosGenHTML = function()
		{
			this._refreshView.refresh(true);
		}

		return Base.extend(Class);
	}
);