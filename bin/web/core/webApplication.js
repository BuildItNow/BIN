define(["bin/core/application"], 
	function(Application)
	{
		var Class = {};

		Class.init = function()
		{
			Application.prototype.init.apply(this);

			this._hudManager = new bin.core.HUDManager();
			this._hudManager.init();
			bin.hudManager  = this._hudManager;

			if(this.appBootBg && !this.appBootBg.time)
			{
				this.appBootBg.time = page.pageConfig.appBootBgTime || bin.globalConfig.appBootBgTime;
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
