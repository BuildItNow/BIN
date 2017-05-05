define([
"bin/common/refreshView", 
(bin.componentConfig.refreshFooter || "bin/common/refreshFooterView"), 
"bin/core/util", 
"bin/common/itemProvider",
"bin/common/dataProvider",
"bin/core/view"
], 
function(Base, RefreshFooterView, util, ItemProvider, DataProvider, View)
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
		var self = this;
		options.onRefresh = function(){ self._reload()};
		if(options.autoRefresh === undefined)
		{
			options.autoRefresh = "animation";
		}
		
		this._refreshFooter = options.footerClass ? options.footerClass.create() : RefreshFooterView.create();
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
			self._loadMore();
		};

		this._defaultDelegateHandler = function(event, i, listView)
		{
			var itemView = listView.getItem(i);

			if(event.type === "click" && itemView.onClick)
			{
				return itemView.onClick(event, i, listView);
			}

			if(itemView.onEvent)
			{
				return itemView.onEvent(event, i, listView);
			}
		}
	 
		Base.prototype.constructor.call(this, options);
	}

	Class.posGenHTML = function()
	{
		Base.prototype.posGenHTML.call(this);

		this._touchTargetHolder = $("<div id='touchTargetHolder'></div>");
		this._touchTargetHolder.hide();
		this.$().append(this._touchTargetHolder);

		var self = this;
		this.$scrollerContent[0].addEventListener("touchmove", function(e)
		{
			self._touchTarget = e.target;
		});
	}

	Class.onViewLazyLoad = function(view)
	{
		if(view.type() === "autoLoadMore")
		{
			this._loadMore();

			return ;
		}

		Base.prototype.onViewLazyLoad.call(this, view);
	}

	Class.getItem = function(i)
	{
		return this._items[i];
	}

	Class.getData = function(i)
	{
		return this._dataProvider.data(i);
	}

	Class.delegateItemEvent = function(event, selector, handler)
	{
		if(typeof selector === "function")
		{
			handler  = selector;
			selector = undefined;
		}

		if(!selector)
		{
			selector = ".bin-list-view-item";
		}

		if(!handler)
		{
			handler = this._defaultDelegateHandler;
		}

		var self = this;
		this.$().on(event, selector, function(event)
		{
			var el = event.currentTarget;
			var i  = -1;

			while(el && !(el.__liIndex >= 0))
			{
				el = el.parentNode;
			}

			i = el && el.__liIndex;
			
			if(i >= 0)
			{
				return handler(event, i, self);
			}
		});
	}

	Class._reload = function()
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

		this._touchTargetHolder.empty();
		if(this._touchTarget && this._touchTarget !== this.$scrollerContent[0])	// Avoid touch target is removed, or the touch event will miss
		{
			var elem = $(this._touchTarget);
			elem.hide();

			// Clear this touch target
			elem.attr("id", "");
			elem.removeClass();

			this._touchTargetHolder.append(elem);
		}
		
		this.$scrollerContent.empty();
		this._items = [];
		
		var f = util.newFragment(this.$scrollerContent);
		if(beg < end)
		{
			var v = null;
			for(var i=beg;i<end; ++i)
			{
				v = this._createItemView(i);
				this._items.push(v);

				f.append(v.$());
			}
			
		}
		if(this._dataProvider.anyMore())
		{
			f.append(this._refreshFooter.$());
			this._unhookFooterClick();	// Avoid hook too much times
			this._hookFooterClick();
		}
		if(beg == end && !this._dataProvider.anyMore())
		{
			bin.hudManager.showStatus('加载数据为空！');
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

		var f = util.newFragment(this.$scrollerContent);
		if(beg < end)
		{
			var v = null;
			for(var i=beg;i<end; ++i)
			{
				v = this._createItemView(i);
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

	Class._createItemView = function(i)
	{
		var v = this._itemProvider.createItemView(this, i, this._dataProvider.data(i));
		
		// Add for event delegation
		v.$().addClass("bin-list-view-item");
		v.$()[0].__liIndex = i;

		return v;	
	}

	return Base.extend(Class, {DataProvider:DataProvider, ItemProvider:ItemProvider, TemplateItemProvider:TemplateItemProvider});
});