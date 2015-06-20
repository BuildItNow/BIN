define(["bin/common/refreshView", "bin/util/osUtil", "refreshListViewDemo/refreshFooterView"], function(Base, osUtil, RefreshFooterView)
{
	var Class = {};

	Class.constructor = function(options)
	{
		options.onRefresh = Class._onRefresh.bind(this);
		options.autoRefresh = "animation";

		this._refreshFooter = options.footerClass ? new options.footerClass : new RefreshFooterView();
		
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

	Class.refreshUI = function()
	{
		this._refreshFooter.$().detach();
		this._elemScrollerContent.append(this._refreshFooter.$());
		
		Base.prototype.refreshUI.call(this);
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

			self._unhookFooterClick();
			self._refreshFooter.$().detach();
			self._elemScrollerContent.html(h);
			self._elemScrollerContent.append(self._refreshFooter.$());
			self._hookFooterClick();
			
			self.refreshDone();
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

			self._refreshFooter.$().detach();
			self._elemScrollerContent.append(h);
			self._elemScrollerContent.append(self._refreshFooter.$());
					
			self._loadMoreDone();
		});
	}

	Class._loadMoreDone = function()
	{
		this._hookFooterClick();
		this._refreshFooter.onLoadMoreDone();
		this.refreshUI();
	}

	
	Class._loadMore = function()
	{
		this._refreshFooter.onLoadMore();

		this._unhookFooterClick();

		this._onLoadMore();
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