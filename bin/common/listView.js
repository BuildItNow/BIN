define([
"bin/common/refreshView", 
"bin/util/osUtil", 
"bin/common/refreshFooterView", 
"bin/util/elemUtil", 
"bin/common/itemProvider",
"bin/common/dataProvider",
"bin/core/view",
"underscore"
], 
function(Base, osUtil, RefreshFooterView, elemUtil, ItemProvider, DataProvider, View, _)
{
	var TemplateItemProvider = ItemProvider.extend(
	{
		constructor:function(options)
		{
			ItemProvider.prototype.constructor.call(this, options);

			this._template = _.template(options.template);
		},
		createItemView:function(listView, i, data)
		{
			var html = this._template(data);

			return new View({html:html});
		}
	});

	var GeneratorItemProvider = ItemProvider.extend(
	{
		constructor:function(options)
		{
			ItemProvider.prototype.constructor.call(this, options);

			this._generator = options.generator;
		},
		createItemView:function(listView, i, data)
		{
			return this._generator(i, data);
		}
	});

	var Class = {};

	Class.constructor = function(options)
	{
		options.onRefresh = Class._onRefresh.bind(this);
		options.autoRefresh = "animation";

		this._refreshFooter = options.footerClass ? new options.footerClass : new RefreshFooterView();
		this._dataProvider  = options.dataProvider;

		var t = typeof(options.itemProvider);
		if(t === "string") // template
		{
			this._itemProvider = new TemplateItemProvider({template:options.itemProvider});
		}
		else if(t === "function")
		{
			this._itemProvider = new GeneratorItemProvider({generator:options.itemProvider});
		}
		else
		{
			this._itemProvider  = options.itemProvider;	
		}
		this._items = [];
		
		this._onFooterClick = function()
		{
			this._loadMore();
		}.bind(this)
	 
		Base.prototype.constructor.call(this, options);
	}

	Class.genHTML = function()
	{
		this.$html(null, '<div class="bin-list-view-content"></div>');
		Base.prototype.genHTML.call(this);
	}

	Class.getItem = function(i)
	{
		return this._items[i];
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
				self.refreshDone(true);
			});
	}

	Class._onRefreshData = function(beg, end)
	{
		this._refreshFooter.$().detach();
		
		this._elemScrollerContent.empty();
		this._items = [];
		
		var f = elemUtil.newFragment(this._elemScrollerContent);
		if(beg < end)
		{
			var v = null;
			for(var i=beg;i<end; ++i)
			{
				v = this._itemProvider.createItemView(this, i, this._dataProvider.data(i));
				this._items.push(v);

				f.append(v.$());
			}
			
		}
		if(this._dataProvider.anyMore())
		{
			f.append(this._refreshFooter.$());
			this._hookFooterClick();
		}
		f.setup();

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
				self._hookFooterClick();
				self._refreshFooter.onLoadMoreDone();
			});
	}

	Class._onLoadMoreData = function(beg, end)
	{
		this._refreshFooter.$().detach();

		var f = elemUtil.newFragment(this._elemScrollerContent);
		if(beg < end)
		{
			var v = null;
			for(var i=beg;i<end; ++i)
			{
				v = this._itemProvider.createItemView(this, i, this._dataProvider.data(i));
				this._items.push(v);

				f.append(v.$());
			}
		}

		if(this._dataProvider.anyMore())
		{
			f.append(this._refreshFooter.$());
			this._hookFooterClick();
		}

		f.setup();

		this._refreshFooter.onLoadMoreDone();
		
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

	return Base.extend(Class, {DataProvider:DataProvider, ItemProvider:ItemProvider, TemplateItemProvider:TemplateItemProvider});
});