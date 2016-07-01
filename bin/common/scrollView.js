define(["bin/core/view", "iscroll"], 
function(Base, iscroll)
{
	var Class = {};

	Class.constructor = function(options)
	{
		this._options = options || {gotoTop:true};

		if(this._options.gotoTop === undefined)
		{
			this._options.gotoTop = true;
		}

		this._elemScroller = null;
		this.$scrollerContent = null;
		
		Base.prototype.constructor.call(this, options);
	}

	Class.genHTML = function()
	{
		Base.prototype.genHTML.call(this);

		this.$scrollerContent = $('<div class="bin-scroll-view-content">');
		this.$scrollerContent.append(this.$().children());

		this._elemScroller = $("<div style='position:relative;top:0px;height:auto;'></div>");
		
		this._elemScroller.append(this.$scrollerContent);
		this.$().append(this._elemScroller);

		this._lazyLoadEnable = this.$().hasClass("bin-lazyload-container"); 
	}

	Class.posGenHTML = function()
	{
		this.scroller = new IScroll(this.el, {alwaysScrollY:true, probeType:this._lazyLoadEnable || this._options.gotoTop ? 3 : 2, bounce:true, bounceTime:200, useTransition:false, mouseWheel:false});
		
		var self = this;
		this.scroller.on("scroll", function()
		{
			self._onScrollerScroll();
		});

		if(this._options.gotoTop)
		{
			this._elemGotoTop = $("<div class='bin-scroll-goto-top'></div>");
			this._elemGotoTop.on("click", function()
			{
				self.scroller.scrollTo(0, 0, -self.scroller.y/568*50);	
			});

			this._elemGotoTop.hide();
			this._gotoTopShow = false;

			this.$().append(this._elemGotoTop);

			
		}
	}

	Class.asyncPosGenHTML = function()
	{
		this.refreshUI();
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

				self._contentDirty = false;

				if(self._lazyLoadEnable)
				{
					self.lazyLoadContainer();		
				}
			}, 0);
		}
	}

	Class.onRemove = function()
	{
		if(this.scroller)
		{
			delete this.scroller;
		}
	}

	Class._onScrollerScroll = function()
	{
		if(this._lazyLoadEnable)
		{
			this._llOnScroll();
		}

		if(this._options.onScroll)
		{
			this._options.onScroll(this);
		}

		if(this._elemGotoTop)
		{
			if(this._gotoTopShow && -this.scroller.y < this.scroller.wrapperHeight)
			{
				this._gotoTopShow = false;
				this._elemGotoTop.hide();
			}
			else if(!this._gotoTopShow && -this.scroller.y >= this.scroller.wrapperHeight)
			{
				this._gotoTopShow = true;
				this._elemGotoTop.show();
			}
		}
	}

	return Base.extend(Class);
})