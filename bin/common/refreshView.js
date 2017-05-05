define(["bin/core/view", "iscroll", (bin.componentConfig.refreshHeader || "bin/common/refreshHeaderView") ], 
function(Base, iscroll, RefreshHeaderView)
{
	var Class = {};

	var REFRESH_STATE_NONE = 0;
	var REFRESH_STATE_READY = 1;
	var REFRESH_STATE_REFRESHING = 2;
	var REFRESH_STATE_DONE_WATING = 3;
	var REFRESH_STATE_DONE = 4;

	Class.constructor = function(options)
	{
		this._noPullToRefresh = options.noPullToRefresh;
		if(!this._noPullToRefresh)
		{
			this._refreshHeader = options.headerClass ? options.headerClass.create() : RefreshHeaderView.create();
			this._headerHeight  = this._refreshHeader.height();
		}
		this._onRefresh     = options.onRefresh;
		this._autoRefresh   = options.autoRefresh;
		
		this._elemScroller = null;
		this.$scrollerContent = null;
		this._contentDirty = false;
		this._refreshState = REFRESH_STATE_NONE;
	
		Base.prototype.constructor.call(this, options);
	}

	Class.genHTML = function()
	{
		Base.prototype.genHTML.call(this);

		this.$scrollerContent = $('<div class="bin-refresh-view-content">');
		this.$scrollerContent.append(this.$().children());

		this._elemScroller = $("<div style='position:relative;top:0px;height:auto;'></div>");
		
		if(!this._noPullToRefresh)
		{
			this._elemScroller.append(this._refreshHeader.$());
		}

		this._elemScroller.append(this.$scrollerContent);
		this.$().append(this._elemScroller);

		this._lazyLoadEnable = this.$().hasClass("bin-lazyload-container"); 
	}

	Class.posGenHTML = function()
	{
		this.scroller = new IScroll(this.el, {alwaysScrollY:true, probeType:this._lazyLoadEnable ? 3 : 2, bounce:true, bounceTime:200, useTransition:false, mouseWheel:false});
		
		var self = this;
		this.scroller.on("userTouchStart", function()
		{
			self._onScrollerTouchStart();
		});

		this.scroller.on("userTouchEnd", function()
		{
			self._onScrollerTouchEnd();
		});

		this.scroller.on("scroll", function()
		{
			self._onScrollerScroll();
		});
	}

	Class.asyncPosGenHTML = function()
	{
		this.refreshUI();

		if(this._autoRefresh)
		{
			this.refresh(this._autoRefresh === "animation");
		}
	}

	Class.refresh = function(ani)
	{	
		if(this._refreshState !== REFRESH_STATE_NONE && this._refreshState !== REFRESH_STATE_DONE)
		{
			return ;
		}

		var self = this;
		setTimeout(function()
		{
			// Check again
			if(self._refreshState !== REFRESH_STATE_NONE && self._refreshState !== REFRESH_STATE_DONE)
			{	
				return ;
			}

			if(!self._noPullToRefresh && ani)
			{
				self.scroller.options.pullToRefresh = true;
				self.scroller.scrollTo(0, self._headerHeight, 100);	
			}
			
			self._refresh();
		}, 0);
	}

	Class.refreshUI = function()
	{
		if(this.scroller)
		{
			if(this._contentDirty)
			{
				return ;
			}

			this._contentDirty = true;

			var self = this;
			setTimeout(function()
			{

				self.scroller.refresh();

				if(self._refreshDoneOptions)
				{
					self.scroller.scrollTo(0, self._refreshDoneOptions.y, self._refreshDoneOptions.time || 1);

					delete self._refreshDoneOptions; 
				}

				self._contentDirty = false;

				if(self._lazyLoadEnable)
				{
					self.lazyLoadContainer();		
				}
			}, 0);
		}
	}

	Class.refreshDone = function(fail, options)
	{
		var self = this;
		if(this._noPullToRefresh)
		{
			// refresh the scroller
			this.refreshUI();

			if(!options)
			{
				setTimeout(function()
				{
					self._refreshState = REFRESH_STATE_DONE;
					if(self.scroller.y < self.scroller.maxScrollY)
					{
						self.scroller.scrollTo(0, self.scroller.maxScrollY, 100);
					}
				}, 0);
			}
			else
			{
				this._refreshDoneOptions = options;
				setTimeout(function()
				{
					self._refreshState = REFRESH_STATE_DONE;
				}, 0);
			}

			return ;
		}

		this._refreshState = REFRESH_STATE_DONE_WATING;
		this._refreshHeader.onRefreshDone(fail);

		// refresh the scroller
		this.refreshUI();
		
		if(!options)
		{
			setTimeout(function()
			{
				self._refreshState = REFRESH_STATE_DONE;
				self.scroller.options.pullToRefresh = false;
				if(/*!self._scrollerTouching &&*/ self.scroller.y > 0)
				{
					self.scroller.scrollTo(0, 0, 100);
				}
				else if(self.scroller.y < self.scroller.maxScrollY)
				{
					self.scroller.scrollTo(0, self.scroller.maxScrollY, 100);
				}
			}, 500);
		}
		else
		{
			this._refreshDoneOptions = options;
			setTimeout(function()
			{
				self._refreshState = REFRESH_STATE_DONE;
				self.scroller.options.pullToRefresh = false;
			}, 0);
		}
	}

	Class.onRemove = function()
	{
		if(this.scroller)
		{
			this.scroller.destroy();
			//delete this.scroller;
		}
	}

	Class._onScrollerTouchStart = function()
	{
		if(this._noPullToRefresh)
		{
			return ;
		}

		this._scrollerTouching = true;

		if(this._refreshState === REFRESH_STATE_DONE)
		{
			this._refreshState = REFRESH_STATE_NONE;
		}
	}

	Class._onScrollerTouchEnd = function()
	{
		if(this._noPullToRefresh)
		{
			return ;
		}

		this._scrollerTouching = false;

		if(this._refreshState === REFRESH_STATE_READY)
		{
			this.scroller.options.pullToRefresh = true;
			this.scroller.scrollTo(0, this._headerHeight, 100);	
			
			this._refresh();
		}
		else if(this._refreshState === REFRESH_STATE_REFRESHING)
		{
			if(this.scroller.y > this._headerHeight)
			{
				this.scroller.scrollTo(0, this._headerHeight, 100);
			}
			else if(this.scroller.y > 0)
			{
				this.scroller.scrollTo(0, 0, 100);
			}	
		}
	}

	Class._onScrollerScroll = function()
	{
		if(this._lazyLoadEnable)
		{
			this._llOnScroll();
		}

		if(this._noPullToRefresh)
		{
			return ;
		}

		if(!this._scrollerTouching)
		{
			return ;
		}

		if(this._refreshState === REFRESH_STATE_REFRESHING || this._refreshState === REFRESH_STATE_DONE_WATING || this._refreshState === REFRESH_STATE_DONE)
		{
			return ;
		}

		this._refreshState = this._refreshHeader.onScrollTo(this.scroller.y) ? REFRESH_STATE_READY : REFRESH_STATE_NONE;
	}

	Class._refresh = function()
	{
		this._refreshState = REFRESH_STATE_REFRESHING;
			
		if(!this._noPullToRefresh)
		{
			this._refreshHeader.onRefresh();
		}

		if(this._onRefresh)
		{
			this._onRefresh(this);
		}
	}

	return Base.extend(Class);
})