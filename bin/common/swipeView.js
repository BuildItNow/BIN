define(["bin/core/view", "swiper"], function(Base, Swiper)
{
	var Class = 
	{

	};

	var SWIPER_DEFAULT_OPTIONS = 
	{
		loop : false,
		shortSwipes:true
	};

	Class.constructor = function(options)
	{
		this._onChange      = options.onChange;
		this._swiperOptions = options.swiperOptions || {}; 
		if(options.current !== undefined)
		{
			this._swiperOptions.initialSlide = options.current;
		}
		else if(this._swiperOptions.initialSlide === undefined)
		{
			this._swiperOptions.initialSlide = 0;
		}

		_.defaults(this._swiperOptions, SWIPER_DEFAULT_OPTIONS);
		var self = this;
		this._swiperOptions.onTransitionEnd = function(swiper)
		{
			var index = swiper.activeIndex;
			if(self._swiperOptions.loop)
			{
				index = self.$(".swiper-slide")[index].getAttribute("data-swiper-slide-index");
			}
			self._onSwiperSwipe(index);
		};

		Base.prototype.constructor.call(this, options);
	}

	Class.genHTML = function()
	{
		Base.prototype.genHTML.call(this);

		if(!this.$().hasClass("swiper-container"))
		{
			this.$().addClass("swiper-container");
			var children = this.$().children();

			// Generate wrapper and slide holder
			var wrapperHtml = '<div class="swiper-wrapper">';
			for(var i=0,i_sz=children.length; i<i_sz; ++i)
			{
				this.$()[0].removeChild(children[i]);

				wrapperHtml += '<div class="swiper-slide" style="background-color:transparent"></div>';
			}
			wrapperHtml += '</div>'
			
			this.$swiperContent = $(wrapperHtml);
			var slideHolders = this.$swiperContent.children();
			for(var i=0,i_sz=children.length; i<i_sz; ++i)
			{
				slideHolders[i].appendChild(children[i]);
			}
			
			this.$().append(this.$swiperContent);
		}
		else
		{
			this.$swiperContent = this.$(".swiper-wrapper");
		}
	}

	// Class.appendSlide = function(slide, refresh)
	// {
	// 	var elem = $('<div class="swiper-slide" style="background-color:transparent"></div>');
	// 	elem.append(slide);

	// 	if(refresh)
	// 	{
	// 		this.swiper.appendSlide(elem[0]);
	// 	}
	// 	else
	// 	{
	// 		this.$swiperContent.append(elem);
	// 	}
	// }

	// Class.removeSlide = function(index, refresh)
	// {
	// 	if(refresh)
	// 	{
	// 		this.swiper.removeSlide(index);
	// 	}
	// 	else
	// 	{
	// 		$(this.$swiperContent.children()[index]).remove();
	// 	}
	// }

	// Class.removeAllSlides = function(refresh)
	// {
	// 	if(refresh)
	// 	{
	// 		this.swiper.removeAllSlides();
	// 	}
	// 	else
	// 	{
	// 		this.$swiperContent.html("");
	// 	}
	// }

	Class.posGenHTML = function()
	{
		this.swiper = new Swiper(this.$(), this._swiperOptions);
		if(this._swiperOptions.initialSlide === 0 && !this._swiperOptions.loop)	// Swiper don't trigger event when initialSlide is 0
		{
			this._onSwiperSwipe(this._swiperOptions.initialSlide);
		}
	}

	Class.asyncPosGenHTML = function()
	{
		this.refreshUI();
	}

	Class.setCurrent = function(index, noTrigger)
	{
		if(this._swiperOptions.loop)
		{
			index = index + this.swiper.loopedSlides;
		}
		this.swiper.slideTo(index, undefined, !noTrigger);
	}

	Class.getCurrent = function()
	{
		return this.swiper.activeIndex; 
	}

	Class.slideNext = function(noTrigger)
	{
		this.swiper.slideNext(!noTrigger);
	}

	Class.slidePrev = function(noTrigger)
	{
		this.swiper.slidePrev(!noTrigger);
	}

	Class.refreshUI = function(reset)
	{
		if(reset)
		{
			if(this.swiper)
			{
				this.swiper.destroy(true, true);
			}

			this._swiperOptions.initialSlide = 0;
			this.swiper = new Swiper(this.$(), this._swiperOptions);
			if(!this._swiperOptions.loop)	// Swiper don't trigger event when initialSlide is 0
			{
				this._onSwiperSwipe(0);
			}
		}
		else
		{
			this.swiper.update(true);
		}
	}

	Class.onRemove = function()
	{
		if(this.swiper)
		{
			this.swiper.destroy(true);
			delete this.swiper;
		}
	}

	Class._onSwiperSwipe = function(index)
	{
		if(this._onChange)
		{
			this._onChange(this, index);
		}
	}

	return Base.extend(Class);
});