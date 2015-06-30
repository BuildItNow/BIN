define(["bin/core/view", "swiper"], function(Base, Swiper)
{
	var Class = 
	{

	};

	Class.constructor = function(options)
	{
		this._initCurrent = options.current;
		this._onChange    = options.onChange;
		this._current     = null;

		Base.prototype.constructor.call(this, options);
	}

	Class.genHTML = function()
	{
		this._slides = [];
		
		this.$().addClass("swiper-container");
		var children = this.$().children();
		var child = null;

		// Generate wrapper and slide holder
		var wrapperHtml = '<div class="swiper-wrapper">';
		for(var i=0,i_sz=children.length; i<i_sz; ++i)
		{
			child = $(children[i]);
			child.detach();

			this._slides.push(child);

			wrapperHtml += '<div class="swiper-slide" style="background-color:transparent"></div>';
		}
		wrapperHtml += '</div>'
		
		this._slideWrapper = $(wrapperHtml);
		
		this.$().append(this._slideWrapper);
	}

	Class.asyncPosGenHTML = function()
	{
		// Add content slide to holder
		var slideHolders = this._slideWrapper.children();
		for(var i=0,i_sz=this._slides.length; i<i_sz; ++i)
		{
			$(slideHolders[i]).append(this._slides[i]);
		}

		delete this._slides;
		delete this._slideWrapper;

		var self    = this;
		var options = 
		{
			onSlideChangeEnd : function(swiper){self._onSwiperSwipe(swiper.activeIndex)},
			initialSlide : this._initCurrent ? this._initCurrent : 0,
			loop : false,
			shortSwipes:true,
		};

		delete this._initCurrent;

		this._swiper = new Swiper(this.$(), options);
		if(options.initialSlide === 0)	// Swiper don't trigger event when initialSlide is 0
		{
			this._onSwiperSwipe(options.initialSlide);
		}
	}

	Class.setCurrent = function(index, noTrigger)
	{
		if(this.getCurrent() === index)
		{
			return ;
		}

		this._swiper.slideTo(index, undefined, !noTrigger);
		if(noTrigger)
		{
			this._current = index;
		}
	}

	Class.getCurrent = function()
	{

		return this._current!==null ? this._current : this._initCurrent; 
	}

	Class.onRemove = function()
	{
		if(this._swiper)
		{
			this._swiper.destroy(false);
			delete this._swiper;
		}
	}

	Class._onSwiperSwipe = function(index)
	{
		this._current = index;

		if(this._onChange)
		{
			this._onChange(this, this._current);
		}
	}

	return Base.extend(Class);
});