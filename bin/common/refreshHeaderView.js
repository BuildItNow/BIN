define(["text!bin/common/refreshHeaderView.html", "bin/core/view", "bin/util/disUtil"], 
function(html, Base, disUtil)
{
	var Class = 
	{
		
	};

	Class.height = function()
	{
		return disUtil.rem2px(2);
	}

    Class.posGenHTML = function()
    {
        this._elemArrow   = this.$("#arrow");        
        this._elemLoading = this.$("#loading");
        this._elemTips    = this.$("#tips");
        this._elemLoading.hide();
    }

	Class.asyncPosGenHTML = function()
	{
		this._height    = this.height();
		this._threshold = disUtil.rem2px(2.5);
	}

	Class.onScrollTo = function(y)
	{
		var ret = y > this._threshold;
        
        if(ret)
        {
            this._elemArrow.addClass("RefreshHeaderView-arrow-up");
            this._elemTips.text("释放刷新");
        }
        else
        {
            this._elemArrow.removeClass("RefreshHeaderView-arrow-up");
            this._elemTips.text("下拉刷新");
        }
		
		return ret;
	}

	Class.onRefresh = function()
	{
        this._elemArrow.removeClass("RefreshHeaderView-arrow-up");
        this._elemArrow.hide();
        this._elemLoading.show();
        this._elemTips.text("刷新中...");
	}

	Class.onRefreshDone = function(fail)
	{
        this._elemLoading.hide();
        this._elemArrow.show();
        this._elemTips.text(fail ? "刷新失败" : "刷新成功");
	}

	return Base.extend(Class, {html:html});
});
