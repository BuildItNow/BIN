define(["text!bin/common/refreshHeaderView.html", "bin/core/view", "bin/util/disUtil"], 
function(html, Base, disUtil)
{
	var Class = 
	{
		html:html,
	};

	Class.height = function()
	{
		return disUtil.rem2px(2);
	}

	Class.asyncPosGenHTML = function()
	{
		this._height    = this.height();
		this._threshold = this._height+5;
	}

	Class.onScrollTo = function(y)
	{
		var ret = y > this._threshold;

		this.$text("#tips", ret ? "释放刷新" : "下拉刷新");
		
		return ret;
	}

	Class.onRefresh = function()
	{
		this.$text("#tips", "刷新中...");
	}

	Class.onRefreshDone = function()
	{
		this.$text("#tips", "下拉刷新");
	}

	return Base.extend(Class);
});