define(["bin/common/refreshView", "bin/util/osUtil", "refreshListViewDemo/refreshFooterView"], function(Base, osUtil, RefreshFooterView)
{
	var Class = {};

	Class.constructor = function(options)
	{
		options.onRefresh = Class._onRefresh.bind(this);
		options.autoRefresh = "animation";

		this._refreshFooter = options.footerClass ? new options.footerClass : new RefreshFooterView();
		this._dataProvider  = options.dataProvider;
		this._itemProvider  = options.itemProvider;
		
		var self = this;
		this._onFooterClick = function()
		{
			self._loadMore();
		}
	 
		Base.prototype.constructor.call(this, options);
	}

	Class.genHTML = function()
	{
		this.$html(null, '<div class="bin-list-view-content"></div>');
		Base.prototype.genHTML.call(this);
	}

	Class._onRefresh = function()
	{
		var self = this;
		this._dataProvider.refresh(
			function(beg, end)
			{
				self._onRefreshData(beg, end);
			}, 
			function(error)
			{

			});
	}

	Class._onRefreshData = function(beg, end)
	{
		this._refreshFooter.$().detach();

		if(beg < end)
		{
			var h = "";
			for(var i=beg;i<end; ++i)
			{
				h += "<li>Pretty row"+i+"</li>";
			}

			this._elemScrollerContent.html(h);
		}

		if(this._dataProvider.anyMore())
		{
			this._elemScrollerContent.append(this._refreshFooter.$());
			this._hookFooterClick();
		}

		this.refreshDone();
	}

	Class._loadMore = function()
	{
		this._refreshFooter.onLoadMore();

		this._unhookFooterClick();

		var self = this;
		this._dataProvider.loadMore(
			function(beg, end)
			{
				self._onLoadMoreData(beg, end);
			}, 
			function(error)
			{

			});
	}

	Class._onLoadMoreData = function(beg, end)
	{
		this._refreshFooter.$().detach();

		if(beg < end)
		{
			var h = "";
			for(var i=beg;i<end; ++i)
			{
				h += "<li>Pretty row"+i+"</li>";
			}

			this._elemScrollerContent.append(h);
		}

		this._refreshFooter.onLoadMoreDone();
		
		if(this._dataProvider.anyMore())
		{
			this._elemScrollerContent.append(this._refreshFooter.$());
			this._hookFooterClick();
		}

		this.refreshUI();
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