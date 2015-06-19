define(["bin/core/view", "iscroll", "bin/util/osUtil", "bin/util/disUtil", "bin/common/refreshHeaderView"], 
function(Base, iscroll, osUtil, disUtil, RefreshHeaderView)
{
	var Class = {};

	var REFRESH_STATE_NONE = 0;
	var REFRESH_STATE_READY = 1;
	var REFRESH_STATE_REFRESHING = 2;
	var REFRESH_STATE_DONE = 3;

	Class.constructor = function(options)
	{
		this._refreshHeader = options.headerClass ? new options.headerClass() : new RefreshHeaderView();
		this._headerHeight  = this._refreshHeader.height();
		this._onRefresh = options.onRefresh;

		this._elemScroller = null;
		this._elemScrollerContent = null;
		this._contentDirty = false;
	
		Base.prototype.constructor.call(this, options);
	}

	Class.genHTML = function()
	{
		Base.prototype.genHTML.call(this);

		this._elemScrollerContent = $(this.$()[0].children[0]);
		this._elemScrollerContent.detach();

		this._elemScroller = $("<div style='position:relative;top:0px;height:auto;'></div>");
		
		this._elemScroller.append(this._refreshHeader.$());
		this._elemScroller.append(this._elemScrollerContent);
		this.$().append(this._elemScroller);
	}

	Class.asyncPosGenHTML = function()
	{
		this._scoller = new IScroll(this.el, {alwaysScrollY:true, probeType:2, bounce:true, useTransition:false});
		this._refreshState = REFRESH_STATE_NONE;

		var self = this;
		this._scoller.on("userTouchStart", function()
		{
			self._onScrollerTouchStart();
		});

		this._scoller.on("userTouchEnd", function()
		{
			self._onScrollerTouchEnd();
		});

		this._scoller.on("scroll", function()
		{
			self._onScrollerScroll();
		});
	}

	Class._onScrollerTouchStart = function()
	{
		this._scrollerTouching = true;

		if(this._refreshState === REFRESH_STATE_DONE)
		{
			this._refreshState = REFRESH_STATE_NONE;
		}
	}

	Class._onScrollerTouchEnd = function()
	{
		this._scrollerTouching = false;

		if(this._refreshState === REFRESH_STATE_READY)
		{
			this._scoller.options.pullToRefresh = true;
			this._refreshState = REFRESH_STATE_REFRESHING;
			this._scoller.scrollTo(0, this._headerHeight, 100);	
			
			this._refresh();
		}
		else if(this._refreshState === REFRESH_STATE_REFRESHING)
		{
			if(this._scoller.y > this._headerHeight)
			{
				this._scoller.scrollTo(0, this._headerHeight, 100);
			}
			else if(this._scoller.y > 0)
			{
				this._scoller.scrollTo(0, 0, 100);
			}	
		}
	}

	Class._onScrollerScroll = function()
	{
		if(!this._scrollerTouching)
		{
			return ;
		}

		if(this._refreshState === REFRESH_STATE_REFRESHING || this._refreshState === REFRESH_STATE_DONE)
		{
			return ;
		}

		this._refreshState = this._refreshHeader.onScrollTo(this._scoller.y) ? REFRESH_STATE_READY : REFRESH_STATE_NONE;
	}

	Class._refresh = function()
	{
		this._refreshHeader.onRefresh();

		if(this._onRefresh)
		{
			this._onRefresh();
		}
	}

	Class.refresh = function()
	{
		if(this._scoller)
		{
			if(this._contentDirty)
			{
				return ;
			}

			this._contentDirty = true;

			osUtil.nextTick(function()
			{
				this._scoller.refresh();

				this._contentDirty = false;
			}.bind(this));
		}
	}

	Class.refreshDone = function()
	{
		this._refreshState = REFRESH_STATE_DONE;
		this._scoller.options.pullToRefresh = false;

		this._refreshHeader.onRefreshDone();

		if(!this._scrollerTouching && this._scoller.y > 0)
		{
			this._scoller.scrollTo(0, 0, 100);
		}

		// refresh the scroller
		this.refresh();
	}

	return Base.extend(Class);
})