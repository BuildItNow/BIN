define([], 
	function()
	{
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
			this._netManager = new bin.core.NetManager();
			this._netManager.init();

			this._dataCenter = new bin.core.DataCenter();
			this._dataCenter.init();

			bin.netManager = this._netManager;
			bin.dataCenter  = this._dataCenter;
			
			if(bin.globalConfig.mapSDK)
			{
				require(["bin/core/mapManager"], function(MapManager)
				{
					self._mapManager = new MapManager();
					self._mapManager.init();
					bin.mapManager = self._mapManager;
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
			
		}

		Class.exit = function()
		{
			
		}

		_.extend(Class, Backbone.Events);

		return Application;
	}
);
