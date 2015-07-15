define(
	["backbone", "underscore", "bin/common/extend", "bin/util/osUtil", "bin/util/pathUtil", "bin/core/navigationController-ioEffecters"],
function(Backbone, _, extend, osUtil, pathUtil, effecters)
{
	var NavigationRouter = Backbone.Router.extend(
	{
		initialize:function(callback)
		{
			Backbone.Router.prototype.initialize.call(this);
			
			this._callbackImpl = callback;
		},
		routes: 
		{
			'*path(?*queryString)': '_callback',
		},
		_callback: function(path, queryString)
		{
			this._callbackImpl(path, queryString);
		}
	});

	var toNaviName = function(path)
	{
	    if(!path || path === "")
	    {
	       return "";
	    }

	    path = pathUtil.toLeftSlash(path);
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

  	var queryParams = function(queryString) 
  	{
  		var ret = {_queryString:queryString};
  		if(queryString === undefined || queryString === null || queryString === "")
  		{
  			return ret;
  		}
		
		var pairs = queryString.split("&");
		var k = null;
		var v = null;
		var pair = null;
		for(i = 0; i < pairs.length; ++i) 
		{
			pair = pairs[i].split('=');
			if(pair.length === 2)
			{
				ret[pair[0]] = pair[1];
			}
		}

		return ret;
	}

	var viewKey = function(path, queryString)
	{
		path = pathUtil.toLeftSlash(path);
		if(path[0] === '/')
      	{
      		path = path.substring(1);
      	}

		return queryString ? path+'?'+queryString : path;
	} 

	var DEFAULT_IO_EFFECT = bin.globalConfig.pageIOAnim;

	var NavigationController = function()
	{
      	this._views = [];
	    this._pushData = null;
	    this._popData  = null;
	    //this._stackV   = 0;
	}

	NavigationController.extend = extend;

	var cls = NavigationController.prototype;

	cls.count = function()
	{
		return this._views.length;
	}

	cls.init = function()
	{
		var self = this;
		this._router = new NavigationRouter(function(path, queryString){self._route(path, queryString)});
		this._container = $("#navigationContainer");

		Backbone.history.start({pushState: false, silent:true});

		console.info("NavigationController module initialize");
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
		var now = new Date().getTime();
		if(this._popData && (now - this._popData.time) < 500)	// Too fast, reject
		{
			console.warning("pop too fast");
			
			return false;
		}

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

		this._popData = {data:popData, options:options, count:count, time:now};
		window.history.go(-count);

		return true;
	}

	// NB. Can't call push many time once, Because async require(Load view) will break the calling order.
	cls.push = function(name, pushData, options)
	{
		var now = new Date().getTime();
		if(this._pushData && (now - this._pushData.time) < 500)	// Too fast, reject
		{
			console.warning("push too fast");
			
			return false;
		}

		options = options || {trigger: true};
		if(options.trigger === undefined)
		{
			options.trigger = true;
		}

		var effecter = null;
		if(options.effect)
		{
			effecter = effecters[options.effect];
			effecter = effecter || effecters["noIO"];
		}
		else
		{
			effecter = effecters[DEFAULT_IO_EFFECT];
		}

		var pos = name.indexOf('?');
		var path = name;
		var queryString = null;
		if(pos >= 0)
		{
			path = name.substring(0, pos);
			queryString = name.substring(pos+1);
		}
		
		path = toNaviName(path);
      	name = queryString ? path+"?"+queryString : path;

		this._pushData = {path:path, queryString:queryString, data:pushData, options:options, time:now, effecter:effecter};

		Backbone.history.navigate(name, options); // ==> route

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

	cls.startWith = function(view)
	{	
		// Set backgone to a invalid fragment to clear the old url
		Backbone.history.fragment = "";
		
		this._clear();
		this.push(view);
	}

	cls.onDeviceBack = function()
	{
		var curView = this.current();
		if(!curView)
		{
			return false;
		}

		if(curView.view.onDeviceBack && curView.view.onDeviceBack())
		{
			return true;
		}

		if(this.count() === 1)
		{
			bin.hudManager.alert
			({
				message:{text:"确定退出程序?"},
				buttons:
				[
					{text:"确定", onClick:function(v){v.close()}},
					{text:"取消", onClick:function(v){v.close()}},	
				]
			});
		} 
		else 
		{
			this.pop();
		}

		return true;
	}

	cls._clear = function()
	{
		var views = this._views;
        for(var i = views.length-1; i>=0; --i)
        {
        	//console.info("NAVI clear "+views[i].name);
            views[i].view.remove();
        }
        this._views = [];
        this._pushData = null;
        this._popData = null;

        //++this._stackV;
    }

    cls._route = function(path, queryString)
	{
		// this.pop
		if(this._popData)
		{
			this._doPop(this._popData);
			this._popData = null;

			return ;
		}

		// this.push
		if(this._pushData)
		{
			this._pushData.queryParams = queryParams(this._pushData.queryString);
			this._pushData.queryString = null;
			
			this._doPush(this._pushData);
			this._pushData = null;

			return ;
		}

		// window.history.go or window.history.back
		if(path)
		{
			// Check back
			path = toNaviName(path);
			var vk  = viewKey(path, queryString);
			var pos = this._views.length-2;

			for(; pos >= 0; --pos)
			{
				if(this._views[pos].key === vk)
				{
					this._doPop({count:this._views.length-pos-1});
					return ;
				}
			} 

			// Do push
			// Ignore : Must call naviController.push to do naviage operation
			this._doPush({path:path, queryParams:queryParams(queryString), effecter:effecters[DEFAULT_IO_EFFECT]});
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
		var curView  = this.current();
		this._views.pop();
		
		var nxtView =  this._getView(-popData.count);

		if(nxtView.view.onViewBack)
		{
			nxtView.view.onViewBack(curView.name, popData.data);
		}
		
		curView.effecter[1](curView.view, nxtView.view);

        var v = null;
        for(var i=popData.count-1; i>0; --i)
        {
            v = this._views.pop();
            v.view.hide();
            v.view.remove();
        }
    }

	cls._doPush = function(pushData)
	{
		var self = this;

		// Require is async process, avoid _clear and requie conflicting, store the require stack version
		require(['view!' + pushData.path], function(ViewClass)
        {
    	  	var newView = ViewClass.create();
          	newView.$().css("z-index", self.count()+100);
          	var curView = self.current();
          	
          	if(newView.onViewPush)
          	{
          		newView.onViewPush(curView ? curView.name : null, pushData.data, pushData.queryParams);
          	}
          	
          	newView.render();
          	self._container.append(newView.$());
          
          	if(curView)
          	{
          		if(newView.onInAnimationBeg)
          		{
          			osUtil.nextTick(function()
          			{
          				newView.onInAnimationBeg();
          			});
          		}

          		pushData.effecter[0](newView, curView.view, newView.onInAnimationEnd ? function()
          		{
          			osUtil.nextTick(function()
	          		{
	          			newView.onInAnimationEnd();
	          		});
          		} : null);
          	}
          	else
          	{
          		newView.show();
          	}
          
          	var item = {key:viewKey(pushData.path, pushData.queryParams._queryString), view: newView, name:pushData.path, effecter:pushData.effecter};
          	self._views.push(item);
	    }, 
	    function(err)
	    {
	        console.error("NAVI LOAD_ERROR "+err);
	    });
	}

	_.extend(NavigationController.prototype, Backbone.Events);

	return NavigationController;
});