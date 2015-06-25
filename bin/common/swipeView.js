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
		this.$().addClass("swiper-container");
		var elem = $('<div class="swiper-wrapper"></div>');
		var children = this.$().children();
		var child = null;
		for(var i=0,i_sz=children.length; i<i_sz; ++i)
		{
			child = $(children[i]);
			child.detach();
			child.addClass("swiper-slide");
			elem.append(child);
		}

		this.$().append(elem);
	}

	Class.asyncPosGenHTML = function()
	{
		var self    = this;
		var options = 
		{
			onSlideChangeEnd : function(swiper){self._onSwiperSwipe(swiper.activeIndex)},
			initialSlide : this._initCurrent ? this._initCurrent : 0,
			loop : false,
		};

		delete this._initCurrent;

		this._swiper = new Swiper(this.$(), options);
		this._onSwiperSwipe(options.initialSlide);
	}

	Class.setCurrent = function(index, noTrigger)
	{
		if(this._current === index)
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

	Class._onSwiperSwipe = function(index)
	{
		this._current = index;

		if(this._onChange)
		{
			this._onChange(this._current);
		}
	}

	return Base.extend(Class);
});