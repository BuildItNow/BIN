define(
	["bin/core/view"],
function(View)
{
	var toLeftSlash = function(path)
	{
		return path.replace(/\\/g, '/');
	}

	var toNaviName = function(path)
	{
	    if(!path || path === "")
	    {
	       return "";
	    }

	    path = toLeftSlash(path);
      	var s = path[0] === '/' ? 1 : 0;
      	var e = path.lastIndexOf('.html');
      	if(e>=0)
      	{
          	path = path.substring(s, e);
      	}
      	else if(s>0)
      	{
          	path = path.substring(s);
      	}

      	return path;
  	}

	var cls = {};

	cls.constructor = function(options)
	{
		this._views = [];

		this._onPushed  = options && options.onPushed;
		this._onPoped   = options && options.onPoped;
		this._onCleared = options && options.onCleared; 

		View.prototype.constructor.call(this, options);
	}

	cls.genHTML = function()
	{
		View.prototype.genHTML.call(this);
		this._$container = $("<div id='stubViewContainer' style='width:100%;height:100%;'></div>");

		this.$append(null, this._$container);
	}

	cls.count = function()
	{
		return this._views.length;
	}

	cls.popTo = function(name, popData, options)
	{
		name = toNaviName(name);

		var c = -1;
		var i = this.count()-1;
		for(; i>=0; --i)
		{
			if(this._views[i].name === name)
			{
				c = this.count()-i-1;
				break;
			}
		}

		if(c > 0)
		{
			return this.pop(c, popData, options);
		}

		return false;
	}

	// NB. Can't call pop many times once, Because Backbone route only once.  
	cls.pop = function(count, popData, options)
	{
		count = count ? count : 1;
		if(this.count() <= count)
		{
			count = this.count()-1;
		}

		count = Math.max(count, 0);

		if(count === 0)
		{
			return false;
		}

		this._doPop({data:popData, options:options, count:count});

		return true;
	}

	// NB. Can't call push many time once, Because async require(Load view) will break the calling order.
	cls.push = function(name, pushData, options)
	{
		name = toNaviName(name);
		var curr = this.current();
		var itd  = options && options.ignoreTopDuplication;
		var sta  = options && options.start;
		if(sta && this.count() === 1 && !itd && curr.name === name)
		{
			return false;
		}
		else if(!sta && curr && !itd && curr.name === name)
		{
			return false;
		}

		this._doPush({path:name, data:pushData, options:options});

		return true;
	}

	cls.current = function()
	{
		return this._getView(-1);
	}

	cls.getView = function(name)
	{
		var t = typeof(name);
		if(t === 'number')
		{
			return this._getView(name);
		}
		else
		{
			var predicate = null;
			if(t === "function")
			{
				predicate = name;
			}
			else
			{
				var value = toNaviName(name);
				predicate = function(view)
				{
					return view.name === value;
				};
			}

			var i = this.count()-1;
			for(; i>=0; --i)
			{
				if(predicate(this._views[i]))
				{
					return this._views[i];
				}
			}
		}

		return null;
	}

	cls.startWith = function(view, data, options)
	{	
		options = options || {};
		options.start = true;
		
		this.push(view, data, options);
	}

	cls._clear = function()
	{
		var views = this._views;
        for(var i = views.length-1; i>=0; --i)
        {
        	views[i].view.remove();
        }
        this._views = [];

        if(this._onCleared)
        {
        	this._onCleared(this);
        }
    }

	cls._getView = function(i)
	{
		var c = this.count();
		if(c <= 0 || i>=c)
		{
			return null;
		}

		if(i < 0)
		{
			i += c; 
			if(i<0)
			{
				return null;
			}
		}

		return this._views[i];
	}

	cls._doPop = function(popData)
	{
		var nxtView  = this._getView(-popData.count-1);

		if(nxtView.view.onViewBack)
		{
			nxtView.view.onViewBack(curView.name, popData.data);
		}

		var v = null;
		for(var i=popData.count; i>0; --i)
        {
        	v = this._views.pop();
            v.view.hide();
            v.view.remove();
        }

        nxtView.view.show();

        if(this._onPoped)
        {
        	this._onPoped(this, popData.count);
        }
    }

	cls._doPush = function(pushData)
	{
		var self = this;

		bin.viewManager.loadViewClass(pushData.path, function(ViewClass)
        {
        	var newView = ViewClass.create({manualRender:true, elemParent:self._$container});
        	newView.stubController = self;

        	var curView = self.current();
        	var start   = pushData.options && pushData.options.start;
        	
		    if(newView.onViewPush)
			{
				newView.onViewPush(curView && !start ? curView.name : null, pushData.data);
			}

		    if(start)
		    {
		    	self._clear();
		    }
		    else if(curView)
		    {
		    	curView.view.hide();
		    }

		    newView.render();
		    newView.show();

	        self._views.push({view:newView, name:pushData.path});

	        if(pushData.options && pushData.options.onPushed)
	        {
	        	pushData.options.onPushed(newView);
	        }

	        if(this._onPushed)
	        {
	        	this._onPushed(this, pushData.path, newView);
	        }
	    });
	}

	cls.onRemove = function()
	{
		this._clear();
	}

	return View.extend(cls);
});