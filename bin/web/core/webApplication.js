define(["bin/core/application"], 
	function(Application)
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

		var Class = {};

		Class.init = function()
		{
			// Parse query params
			this._queryParams = queryParams();
			bin.queryParams = this._queryParams;

			Application.prototype.init.apply(this);
				
			this._viewManager = new bin.core.ViewManager();
			this._viewManager.init();
			bin.viewManager = this._viewManager;

			if(bin.globalConfig.pageConfig.onInit)
			{
				setTimeout(function()
				{
					bin.globalConfig.pageConfig.onInit();
				});
			}
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

					var options = {path:path, name:name};
					if(root)	// No plugin
					{
						options.elem = elem;
					}
					else		// Use plugin
					{
						options.elemParent = elem;
					}

					bin.viewManager.newView(options)
				}
			}

			if(bin.globalConfig.pageConfig.onRun)
			{
				setTimeout(function()
				{
					bin.globalConfig.pageConfig.onRun();
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

		return Application.extend(Class);
	}
);
