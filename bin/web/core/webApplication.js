// Define document depencies plugin
define("documentdependencies", ["view"], function(ViewPlugin)
{
	var Class = {};
	var deps  = null;

	Class.load = function(name, req, onLoad, config)
    {
    	if(deps)
    	{
    		onLoad(deps);

    		return ;
    	}

    	ViewPlugin.resolveViewInjectionDependencies(document.body, function(data)
    	{
    		deps = data;

    		onLoad(deps);
    	});
    }

	return Class;
});

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

			$("title").html(bin.globalConfig.name);

			Application.prototype.init.apply(this);

			this._hudManager = new bin.core.HUDManager();
			this._hudManager.init();
			bin.hudManager  = this._hudManager;

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
			var BodyView = bin.ui.BodyView;
			if(!BodyView)
			{
				BodyView = bin.ui.View.extend({});
			}

			BodyView.deps = bin.runtimeConfig.documentDependencies;

			document.body.setAttribute("vm", "");
			this._bodyView = BodyView.create({elem:$("body")});	// Fix document dependencies

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
