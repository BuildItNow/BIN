define(["bin/common/refreshView", "refreshListViewDemo/refreshFooterView"], function(Base, RefreshFooterView)
{
	var Class = {};

	Class.constructor = function(options)
	{
		this._refreshFooter = options.footerClass ? new options.footerClass : new RefreshFooterView();
		this._onLoadMore = options.onLoadMore;

		var self = this;
		this._onFooterClick = function()
		{
			self._loadMore();
		}
	 
		Base.prototype.constructor.call(this, options);
	}

	Class.genHTML = function()
	{
		Base.prototype.genHTML.call(this);
		this._ensureFooter();
		this._hookFooterClick();
	}

	Class.asyncPosGenHTML = function()
	{	
		Base.prototype.asyncPosGenHTML.call(this);
	}

	Class.refresh = function()
	{
		this._ensureFooter();
		Base.prototype.refresh.call(this);
	}

	Class.loadMoreDone = function()
	{
		this._hookFooterClick();
		this._refreshFooter.onLoadMoreDone();
		this.refresh();
	}

	Class._ensureFooter = function()
	{
		this._refreshFooter.$().detach();
		this._elemScrollerContent.append(this._refreshFooter.$());
	}	

	Class._loadMore = function()
	{
		this._refreshFooter.onLoadMore();

		this._unhookFooterClick();

		if(this._onLoadMore)
		{
			this._onLoadMore();
		}
	}

	Class._hookFooterClick = function()
	{
		this._refreshFooter.$().on("click", this._onFooterClick);
	}	

	Class._unhookFooterClick = function()
	{
		this._refreshFooter.$().off("click");
	}

	return Base.extend(Class);
});