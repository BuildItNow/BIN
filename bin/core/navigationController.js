define(
	["bin/core/navigationController-ioEffecters", "vue"],
function(effecters, Vue)
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

  	var queryParams = function(queryString) 
  	{
  		var ret = bin.toQueryParams(queryString);
  		ret._queryString = queryString;

  		return ret;
	}

	var viewKey = function(path, queryString)
	{
		path = toLeftSlash(path);
		if(path[0] === '/')
      	{
      		path = path.substring(1);
      	}

		return queryString ? path+'?'+queryString : path;
	} 

	var NavigationController = function()
	{
      	this._views = [];
	    this._pushData = null;
	    this._popData  = null;
		this._pushTime = 0;
		this._popTime = 0;
	}

	NavigationController.extend = bin.extend;

	var cls = NavigationController.prototype;

	cls.count = function()
	{
		return this._views.length;
	}

	cls.init = function()
	{
		var self = this;
		this._container = $("#navigationContainer");

		var pageHistory = bin.globalConfig.pageHistory || "hashChange";
		if(pageHistory === "hashChange")	
		{
			this._useRouter  = true;
			// this._navVerson  = ""+(_.now()%1000);

			bin.router.on("ROUTE-CHANGE", function(path)
			{
				var queryString = bin.router.getRouteQueryString();
				self._route(path, queryString);
			});

			this._isfirstPush = true;
		}
		
		this._zIndex = 100;

		this._defaultIOEffecter = bin.globalConfig.pageIOAnim;

		if(this._defaultIOEffecter && (typeof bin.globalConfig.pageIOAnim === "string"))
		{
			this._defaultIOEffecter = effecters[bin.globalConfig.pageIOAnim] || effecters["rightIO"];
		}
		else if(!this._defaultIOEffecter)
		{
			this._defaultIOEffecter = effecters["rightIO"];
		}

		if(Vue)
		{
			// Add directive to Vue
			var NUMBER_REG = /^[0-9]*$/;
			Vue.directive("navigation", 
			{
				priority:700,
				bind:function()
				{
					var dirc = this;
					var arg  = this.arg || "push";
					var data = undefined;
					var func = undefined;
					var hand = undefined;
					var view = undefined;
					var effe = undefined;
					if(arg === "push")
					{
						view = this.expression;
						data = this.el.getAttribute("pushData");
						effe = this.el.getAttribute("ioEffect");
						func = "push";
					}
					else if(arg === "pop")
					{
						view = this.expression;
						func = "pop";
						if(view)
						{
							if(NUMBER_REG.test(view))
							{
								view = parseInt(view);
							}
							else
							{
								func = "popTo";
							}
						}
						data = this.el.getAttribute("popData");
					}
					else if(arg === "start")
					{
						view = this.expression;
						data = this.el.getAttribute("pushData");
						func = "startWith";
						effe = this.el.getAttribute("ioEffect");
					}

					if(view && typeof view === "string")
					{
						view = Vue.b_makeValueFunction(view);
					}
					
					if(data)
					{
						data = Vue.b_makeValueFunction(data);
					}

					this.handler = function()
					{
						self[func](view && typeof view === "function" ? view(dirc.vm._b_view, dirc.vm, dirc.el) : view, data && typeof data === "function" ? data(dirc.vm._b_view, dirc.vm, dirc.el) : data, {effect:effe});
					}

					this.el.addEventListener("click", this.handler);
				},
				unbind:function()
				{
					this.el.removeEventListener("click", this.handler);
				},
			});
		}

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

	cls.extendIOEffects = function(effects)
	{
		for(var k in effects)
		{
			effecters[k] = effects[k];
		}

		if(typeof bin.globalConfig.pageIOAnim === "string" && effecters[bin.globalConfig.pageIOAnim])
		{
			this._defaultIOEffecter = effecters[bin.globalConfig.pageIOAnim];
		}
	}

	// NB. Can't call pop many times once, Because Backbone route only once.  
	cls.pop = function(count, popData, options)
	{
		var now = _.now();
		if(now - this._popTime < 500)	// Too fast, reject
		{
			console.warn("pop too fast");
			
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

		this._popData = {data:popData, options:options, count:count};
		this._popTime = now;

		if(this._useRouter)
		{
			bin.router.pop(count);
		}
		else
		{
			this._route();
		}

		return true;
	}

	// NB. Can't call push many time once, Because async require(Load view) will break the calling order.
	cls.push = function(name, pushData, options)
	{
		var now = _.now();
		if(now - this._pushTime < 500)	// Too fast, reject
		{
			console.warn("push too fast");
			
			return false;
		}

		options = options || {}

		var effecter = options.effect;
		if(effecter && (typeof effecter === "string"))
		{
			effecter = effecters[effecter] || this._defaultIOEffecter;
		}
		else if(!effecter)
		{
			effecter = this._defaultIOEffecter;
		}

		var pos = name.indexOf('?');
		var path = name;
		var queryString = "";
		if(pos >= 0)
		{
			path = name.substring(0, pos);
			queryString = name.substring(pos+1);
		}
		
		path = toNaviName(path);

		if(this._useRouter)
		{
			var tv = "_t="+now; // +"&_v="+this._navVerson;
			queryString += queryString ? "&"+tv : tv;
		}

      	name = queryString ? path+"?"+queryString : path;

		this._pushData = {path:path, queryString:queryString, data:pushData, options:options, effecter:effecter};
		this._pushTime = now;

		if(this._useRouter)
		{
			bin.router.push(name, undefined, this._isfirstPush ? { replace: true } : undefined);
			this._isfirstPush = false;
		}
		else
		{
			this._route(path, queryString);
		}

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
			return false;
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

		var params = queryParams(queryString);
		// if(params._v !== this._navVerson)
		// {
		// 	return ;
		// }

		// From router
		if(path)
		{
			
			path = toNaviName(path);
			var vk  = viewKey(path, queryString);

			// Check current
			var cv  = this.current();
			if(cv && cv.key === vk)
			{
				return ;
			}

			// Check back
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
			this._doPush({path:path, queryParams:params, effecter:this._defaultIOEffecter});
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
		var curView  = this._views.pop();
		var nxtView  = this._getView(-popData.count);

		if(nxtView.view.onViewBack)
		{
			nxtView.view.onViewBack(curView.name, popData.data);
		}

		// s n
		//		s not change
		// s s
		//		n not change
		// n n 
		//		
		// n s
		//		
		
		var t = curView.native;
		var n = 0;
        var v = null;
        for(var i=popData.count-1; i>0; --i)
        {
            v = this._views.pop();
            v.view.hide();
            v.view.remove();

            if(t || v.native)
            {
            	++n;
            }
           
            t = v.native;
        }

        if(t || nxtView.native)
        {
           	++n;
        }

        var onOutAnimationEnd = function()
        {
        	curView.view.remove();
        }
		
		if(n > 0)
		{
			var OEffecter = curView.effecter[1];

			if(!curView.native)
			{
				OEffecter = nxtView.native ? effecters["nativeSNIO"][1] : effecters["nativeSSIO"][1];
			}

			OEffecter(curView.view, nxtView.view, onOutAnimationEnd);

			cordova.binPlugins.nativeBridge.popNativePageView(n, curView.native || nxtView.native, function(error)
    	  	{
    	  		if(error)
    	  		{
    	  			console.error("Pop native view fail ["+pushData.path+"]");
    	  			return ;
    	  		}
    	  	});

    	  	return ;
		}

		curView.effecter[1](curView.view, nxtView.view, onOutAnimationEnd);
    }

	cls._doPush = function(pushData)
	{
		var self = this;

		// Require is async process, avoid _clear and requie conflicting, store the require stack version
		require(['view!' + pushData.path], function(ViewClass)
        {
    	  	var newView = ViewClass.create({fromNavi:true, manualRender:true});
    	  	var curView = self.current();

    	  	var onNewView = function()	
          	{
          		newView.$().css("z-index", self._zIndex++);
          		
	          	if(newView.onViewPush)
	          	{
	          		newView.onViewPush(curView ? curView.name : null, pushData.data, pushData.queryParams);
	          	}
	          	
	          	newView.render();
	          	self._container.append(newView.$());

	          	if(newView.doRequesting)
	          	{
	          		newView.doRequesting();
	          	}

	          	if(curView)
	          	{
	          		var start = pushData.options && pushData.options.start;
	          		if(start)
		          	{
		          		// Clear previous views except curView
		          		// TODO: Native views
		          		self._views.pop();
				        self._clear();
		          	}

	          		if(newView.onInAnimationBeg)
	          		{
	          			setTimeout(function()
	          			{
	          				newView.onInAnimationBeg();
	          			}, 0);
	          		}

	          		var onInAnimationEnd = null;
	          		if(start)
	          		{
	          			onInAnimationEnd = function()
	          			{
	          				curView.view.remove();
	          				if(newView.onInAnimationEnd)
	          				{
	          					setTimeout(function()
				          		{
				          			newView.onInAnimationEnd();
				          		}, 0);
	          				}

	          				if(newView.doRequestDone)
				          	{
				          		newView.doRequestDone();
				          	}
	          			}
	          		}
	          		else if(newView.onInAnimationEnd)
	          		{
	          			onInAnimationEnd = function()
	          			{
	          				setTimeout(function()
			          		{
			          			newView.onInAnimationEnd();
			          		}, 0);

			          		if(newView.doRequestDone)
				          	{
				          		newView.doRequestDone();
				          	}
	          			}
	          		}
	          		else if(newView.doRequestDone)
	          		{
	          			onInAnimationEnd = function()
	          			{
	          				newView.doRequestDone();
	          			}
	          		}

	          		pushData.effecter[0](newView, curView.view, onInAnimationEnd);
	          	}
	          	else
	          	{
	          		newView.show();
	          		
	          		if(newView.doRequestDone)
				    {
		          		newView.doRequestDone();
		          	}
	          	}
	          
	          	var item = {key:viewKey(pushData.path, pushData.queryParams._queryString), view: newView, name:pushData.path, effecter:pushData.effecter, native:ViewClass.native !== undefined};
	          	self._views.push(item);

	          	if(pushData.options && pushData.options.onPushed)
	          	{
	          		pushData.options.onPushed(newView);
	          	}
	        };

	        if(ViewClass.native)
    	  	{
    	  		pushData.effecter = effecters["nativeIO"];
    	  		if(cordova)
    	  		{
    	  			cordova.binPlugins.nativeBridge.pushNativePageView(pushData.path, newView, curView ? curView.name : undefined, pushData.data, pushData.queryParams, function(error, nativeObject)
    	  			{
    	  				if(error)
    	  				{
    	  					console.error("Push native view fail ["+pushData.path+"]");
    	  					return ;
    	  				}

    	  				newView._nativeObject = nativeObject;
    	  				onNewView();
    	  			});
    	  		}
    	  	}
    	  	else if(!curView)
	        {
	        	if(cordova && cordova.binPlugins && cordova.binPlugins.nativeBridge)
    	  		{
    	  			cordova.binPlugins.nativeBridge.pushStubView(function(error)
    	  			{
    	  				if(error)
    	  				{
    	  					console.error("Start stub view fail");
    	  					return ;
    	  				}

    	  				onNewView();
    	  			});
    	  		}
    	  		else
    	  		{
    	  			onNewView();
    	  		}
	        }
	        else if(curView.native)
	        {
	        	pushData.effecter = effecters["noIO"];
	        	cordova.binPlugins.nativeBridge.pushStubView(function(error)
    	  		{
    	  			if(error)
    	  			{
    	  				console.error("Start stub view fail");
    	  				return ;
    	  			}
    	  			onNewView();
    	  		});
	        }
    	  	else
    	  	{
    	  		onNewView();
    	  	}
	    }, 
	    function(err)
	    {
	        console.error("NAVI LOAD_ERROR "+err);
	    });
	}

	_.extend(NavigationController.prototype, Backbone.Events);

	return NavigationController;
});
