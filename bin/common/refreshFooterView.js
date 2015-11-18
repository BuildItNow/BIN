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

    Class.posGenHTML = function()
    {
        this._elemTips = this.$("#tips");
        this._elemLoading = this.$("#loading");
        this._elemLoading.hide();
    }
	Class.onLoadMore = function()
	{
        this._elemLoading.show();
        this._elemTips.html("加载中...");
	}

	Class.onLoadMoreDone = function()
	{
        this._elemLoading.hide();
        this._elemTips.html("点击加载更多");
	}


	return Base.extend(Class);
});
