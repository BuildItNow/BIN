define(["bin/core/application", "bin/core/mapManager"], 
	function(Application, MapManager)
	{
		var Class = {};

		Class.init = function()
		{
            var mapSDK = bin.globalConfig.mapSDK;
            if(mapSDK)
            {
                this._mapManager = new MapManager();
                this._mapManager.init();
                bin.mapManager = this._mapManager;
            }

            bin.globalConfig.mapSDK = false;
            // In web application, mapManager needs init sync
			Application.prototype.init.apply(this);
            bin.globalConfig.mapSDK = mapSDK;

            this._naviController = new bin.core.NavigationController();
            this._naviController.init();
            bin.naviController = this._naviController;

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
                var queryString = "";

                if(bin.isString(data))
                {
                    queryString = data;
                }
                else
				{
                    queryString = bin.toQueryString(data);
                }

            	url = url+(url.indexOf('?')<0 ? "?" : "&")+queryString;
            }

            window.location.href = url;
		}

		Class.back = function(n)
		{
            if(!n)
            {
                n = -1;
            }
            else if(n>0)
            {
                n = -n;
            }   
			window.history.go(n);
		}

		return Application.extend(Class);
	}
);
