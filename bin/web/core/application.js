define([], 
	function()
	{
		var queryParams = function() 
	  	{
	  		var ret = {};

	  		var i = window.location.href.indexOf("?");
	  		if(i<0)
	  		{
	  			return ret;
	  		}
	  		var queryString = window.location.href.substring(i+1);
	  		i = queryString.lastIndexOf("#");
	  		if(i>=0)
	  		{
	  			queryString = queryString.substring(0, i);
	  		}

	  		if(!queryString)
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

		var Application = function()
		{
			bin.app = this;
		}

		Application.extend = bin.extend;

		var Class = Application.prototype;

		Class.init = function()
		{
			var self = this;

			$(window).on('resize', function()
			{
				self.onResize();

				Backbone.trigger("DISPLAY_METRICS_CHANGED");
			});
			this.onResize();

			// Parse query params
			this._queryParams = queryParams();
			bin.queryParams = this._queryParams;
			
			this._netManager = new bin.core.NetManager();
			this._netManager.init();

			this._dataCenter = new bin.core.DataCenter();
			this._dataCenter.init();

			this._viewManager = new bin.core.ViewManager();
			this._viewManager.init();

			bin.netManager = this._netManager;
			bin.dataCenter  = this._dataCenter;
			bin.viewManager = this._viewManager;

			if(bin.globalConfig.mapSDK)
			{
				require(["bin/core/mapManager"], function(MapManager)
				{
					self._mapManager = new MapManager();
					self._mapManager.init();
					bin.mapManager = self._mapManager;
				});
			}

			if(bin.globalConfig.onInit)
			{
				setTimeout(function()
				{
					bin.globalConfig.onInit();
				});
			}
		}

		Class.onResize = function()
		{
			var elemRoot = document.documentElement;
			this._width  = elemRoot.clientWidth;
	        this._height = elemRoot.clientHeight; 
	        elemRoot.style.fontSize = elemRoot.clientWidth/640*40+"px";
		}

		Class.width = function()
		{
			return this._width;
		}

		Class.height = function()
		{
			return this._height;
		}

		Class.rem = function()
		{
			return parseFloat(document.documentElement.style.fontSize);
		}

		Class.rem2px = function(rem)
	    {
	    	return rem*this.rem();
	    }

	    Class.px2rem = function(px)
	    {
	    	return px/this.rem();
	    }

	    Class.clientWidth = function()
	    {
	    	return this.width();
	    }
		Class.clientHeight = function()
		{
			return this.height();
		}

		Class.run = function()
		{
			var elems = $("div[data-bin-view]");
			if(elems.length > 0)
			{
				var elem = null;
				var path = null;
				var name = null;
				var root = null;
				for(var i=0,i_sz=elems.length; i<i_sz; ++i)
				{
					elem = elems[i];
					path = elem.getAttribute("data-bin-view");
					name = elem.getAttribute("data-bin-name");
					root = elem.getAttribute("data-bin-root");
					bin.viewManager.newView({elem:elem, path:path, name:name, root:root})
				}
			}

			if(bin.globalConfig.onRun)
			{
				setTimeout(function()
				{
					bin.globalConfig.onRun();
				});
			}
		}

		Class.goto = function(url, data)
		{
			if(data)
			{
				var pairs = [];
				var value = null;
				for(var key in data)
            	{
            		value = data[key];
            		if(value !== null && value !== undefined)
            		{
            			if(typeof value === "object")
            			{
            				value = JSON.stringify(value);
            			}
            		}
                	pairs.push(key+"="+value);    
            	}

            	url = url+(url.indexOf('?')<0 ? "?" : "&")+pairs.join("&");
            }

            window.location.href = url;
		}

		Class.back = function(n)
		{

			window.history.back(n);
		}

		Class.exit = function()
		{
			
		}

		return Application;
	}
);
