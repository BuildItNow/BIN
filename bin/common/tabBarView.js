define(["bin/core/view"], function(Base)
{
	var Class = {};

	Class.constructor = function(options)
	{
		this._items  = options.items;
		this._activeStyle = options.activeStyle;
		this._deactiveStyle = options.deactiveStyle;
		this._initCurrent = options.current;
		this._onChange = options.onChange;

		Base.prototype.constructor.call(this, options); 
	}

	Class.posGenHTML = function()
	{
		var self = this;
		var func = function(e)
		{
			self._onTabClick(e.currentTarget.id);
		}
		for(var i=0,i_sz=this._items.length; i<i_sz; ++i)
		{
			this.$("#"+this._items[i]).on("click", func);
		}
	}

	Class.asyncPosGenHTML = function()
	{
		if(this._initCurrent)
		{
			this.setCurrent(this._initCurrent);
			delete this._initCurrent;
		}
	}

	Class.setCurrent = function(item, noTrigger)
	{
		if(this._current)
		{
			this._deactiveItem(this._current);
		}
		this._current = item;
		this._activeItem(this._current);

		if(!noTrigger && this._onChange)
		{
			this._onChange(this, this._current);
		}
	}

	Class.getCurrent = function()
	{
		return this._current || this._initCurrent;
	}

	Class._onTabClick = function(item)
	{
		if(this._current === item)
		{
			return ;
		}

		this.setCurrent(item);
	}

	Class._activeItem = function(item)
	{
		var elem = this.$("#"+item);
		if(typeof(this._deactiveStyle) === "string")
		{
			elem.removeClass(this._deactiveStyle);
		}

		var t = typeof(this._activeStyle);
		if(t === "string")
		{
			elem.addClass(this._activeStyle);
		}
		else if(t === "function")
		{
			this._activeStyle(elem);	
		}
	}

	Class._deactiveItem = function(item)
	{
		var elem = this.$("#"+item);
		if(typeof(this._activeStyle) === "string")
		{
			elem.removeClass(this._activeStyle);
		}

		var t = typeof(this._deactiveStyle);
		if(t === "string")
		{
			elem.addClass(this._deactiveStyle);
		}
		else if(t === "function")
		{
			this._deactiveStyle(elem);	
		}
	}

	return Base.extend(Class);
});