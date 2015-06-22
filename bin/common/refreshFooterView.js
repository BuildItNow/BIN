define(["bin/core/view", "text!bin/common/refreshFooterView.html", "bin/util/disUtil"], 
function(Base, html, disUtil)
{
	var Class = 
	{
		html:html,
	};

	Class.height = function()
	{
		return disUtil.rem2px(2);
	}

	Class.onLoadMore = function()
	{
		this.$html("#tips", "加载中...");
	}

	Class.onLoadMoreDone = function()
	{
		this.$html("#tips", "点击加载更多");
	}


	return Base.extend(Class);
});