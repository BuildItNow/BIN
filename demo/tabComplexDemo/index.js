define(
	["common/demoView", "bin/common/tabView", "bin/common/refreshView", "bin/common/listView", "bin/util/osUtil", "text!tabComplexDemo/view0.html", "text!tabComplexDemo/view1.html"],
	function(Base, TabView, RefreshView, ListView, osUtil, view0html, view1html)
	{
		var Class = {};

		var ItemProvider = ListView.TemplateItemProvider.extend(
		{
			createItemView:function(listView, i, data)
			{
				var v = ListView.TemplateItemProvider.prototype.createItemView.call(this, listView, i, data);

				v.$("#itemContent").on("click", function()
				{
					bin.naviController.push("tabComplexDemo/itemDetail", {id:i, data:data});
				});

				return v;
			}
		});

		Class.posGenHTML = function()
		{
			var self = this;
			this._tabView = new TabView(
			{
				elem : this.$("#tabView"),
				items : ["common", "refresh", "list"],
				current : "common",
				activeStyle:"TabComplexDemoView-tab-item-active",
				deactiveStyle:"TabComplexDemoView-tab-item-deactive",
				onChange:function(view, item)
				{
					self._onChange(view, item);
				}
			});
		}

		Class._onChange = function(view, item)
		{
			var self = this;
			if(item === "refresh" && !this._refreshView)
			{
				this._refreshResult = 0;
				this._refreshView = new RefreshView({elem:view.$("#refreshView"), autoRefresh:"animation", onRefresh:function()
					{
						self._onRefreshViewRefresh();
					}});
			}
			else if(item === "list" && !this._listView)
			{
				this._listView = new ListView({elem:view.$("#listView"), itemProvider:new ItemProvider({template:this.$html("#itemTemplate")}), dataProvider:new ListView.DataProvider({type:"demo"})});
			}
		}

		Class._onRefreshViewRefresh = function()
		{
			var self = this;
			osUtil.delayCall(function()
			{
				if(self._refreshResult == 1)
				{
					self._refreshView.$html("#refreshContent", view0html);

					self._refreshView.refreshDone();
				}
				else if(self._refreshResult == 0)
				{
					self._refreshView.$html("#refreshContent", view1html);
					self._refreshView.$("#goBack").on("click", 
						function()
						{	
							bin.hudManager.alert(
							{
								message:{text:"确定返回吗?"},
								buttons:
								[
									{text:"确定", onClick:function(v, t){v.close(); self.goBack()}},
									{text:"取消", onClick:function(v, t){v.close();}}
								]
							})
						});

					self._refreshView.refreshDone();
				}
				else
				{
					self._refreshView.refreshDone(true);
				}

				++ self._refreshResult;

				self._refreshResult %= 3;
				
				
			}, 1000);
		}


		return Base.extend(Class);
	} 
);