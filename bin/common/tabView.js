define(["bin/core/view", "bin/common/tabBarView", "bin/common/swipeView"],
function(Base, TabBarView, SwipeView)
{
	var Class = {};

	Class.constructor = function(options)
	{
		this._options = options;
		
		Base.prototype.constructor.call(this, options);
	}

	Class.posGenHTML = function()
	{
		var self = this;
		var elem       = this._options.tabBarID ? this.$("#"+this._options.tabBarID) : $(this.$().children()[0]);
		var current    = this._options.current ? this._options.current : this._optinos.items[0];

		var options = 
		{
			elem:elem, 
			items:this._options.items, 
			current:current, 
			onChange:function(view, item)
			{
				self._onTabChange(item);
			},
			activeStyle:this._options.activeStyle,
			deactiveStyle:this._options.deactiveStyle
		};

		this._tabBarView = new TabBarView(options);

		elem = this._options.swipeID ? this.$("#"+this._options.swipeID) : $(this.$().children()[1]);
		options = 
		{
			elem:elem,
			current:this._item2index(current),
			onChange:function(view, index)
			{
				self._onSwipeChange(index);
			}
		}

		this._swipeView = new SwipeView(options);
	}

	Class.getCurrent = function()
	{
		return this._tabBarView.getCurrent();
	}

	Class.getCurrentIndex = function()
	{
		return this._swipeView.getCurrent();
	}

	Class.setCurrent = function(item, noTrigger)
	{
		if(this._tabBarView.getCurrent() == item)
		{
			return ;
		}

		this._tabBarView.setCurrent(item, true);
		this._swipeView.setCurrent(this._item2index(item), true);

		if(!noTrigger && this._options.onChange)
		{
			this._options.onChange(this, item);
		}
	}

	Class.setCurrentIndex = function(index, noTrigger)
	{
		if(this._swipeView.getCurrent() == index)
		{
			return ;
		}

		this.setCurrent(this._options.items[index], noTrigger);
	}

	Class.onRemove = function()
	{
		if(this._swipeView)
		{
			this._swipeView.remove();
			delete this._swipeView;
		}

		if(this._tabBarView)
		{
			this._tabBarView.remove();
			delete this._tabBarView;
		}
	}

	Class._onTabChange = function(item)
	{
		this._swipeView.setCurrent(this._item2index(item), true);
	
		if(this._options.onChange)
		{
			this._options.onChange(this, item);
		}
	}

	Class._onSwipeChange = function(index)
	{
		this._tabBarView.setCurrent(this._options.items[index], true);

		if(this._options.onChange)
		{
			this._options.onChange(this, this._options.items[index]);
		}
	}

	Class._item2index = function(item)
	{
		for(var i=0,i_sz=this._options.items.length; i<i_sz; ++i)
		{
			if(this._options.items[i] === item)
			{
				return i;
			}
		}

		return 0;
	}

	return Base.extend(Class);
});