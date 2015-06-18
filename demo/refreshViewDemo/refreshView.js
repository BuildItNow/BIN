define(["bin/core/view", "iscroll", "bin/util/osUtil", "refreshViewDemo/refreshHeaderView"], 
function(Base, iscroll, osUtil, RefreshHeaderView)
{
	var Class = {};

	var REFRESH_STATE_NONE = 0;
	var REFRESH_STATE_READY = 1;
	var REFRESH_STATE_REFRESHING = 2;
	var REFRESH_STATE_DONE = 3;

	var REFRESH_HEADER_HEIGHT = 100000000000;
	
	Class.constructor = function(options)
	{
		Base.prototype.constructor.call(this, options);

		this._refreshHeader = options.headerClass ? new options.headerClass() : new RefreshHeaderView();
	}

	Class.genHTML = function()
	{
		Base.prototype.genHTML.call(this);

		var content = $(this.$()[0].children[0]);
		content.detach();
		var scrContent = $("<div style='position:relative;top:-2rem'></div>");
		scrContent.append(this._refreshHeader.$());
		scrContent.append(content);
		this.$().append(scrContent);
	}

	Class.asyncPosGenHTML = function()
	{
		REFRESH_HEADER_HEIGHT = this._refreshHeader.$().height();
		
		var self = this;
		this._scoller = new IScroll(this.el, {probeType:2, bounce:true, useTransition:false});

		this._refreshState = REFRESH_STATE_NONE;

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
			this._scoller.scrollTo(0, REFRESH_HEADER_HEIGHT, 100);	
			
			this._onRefresh();

			console.info("Start refresh");
		}
		else if(this._refreshState === REFRESH_STATE_REFRESHING)
		{
			if(this._scoller.y > REFRESH_HEADER_HEIGHT)
			{
				this._scoller.scrollTo(0, REFRESH_HEADER_HEIGHT, 100);
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

	Class._onRefresh = function()
	{
		this._refreshHeader.onRefresh();
		var self = this;
		osUtil.delayCall(function()
		{
			self.refreshDone();
		}, 1000);
	}

	Class.refreshDone = function()
	{
		console.info("Refresh done");

		this._refreshState = REFRESH_STATE_DONE;
		this._scoller.options.pullToRefresh = false;

		this._refreshHeader.onRefreshDone();

		if(!this._scrollerTouching && this._scoller.y > 0)
		{
			this._scoller.scrollTo(0, 0, 100);
		}
	}

	return Base.extend(Class);
})