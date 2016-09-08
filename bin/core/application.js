define([], 
	function()
	{
		/**
		 * The base applicaiton class. Every app(or page in MPA) has exactly one instance of Application (or a subclass of Application).
		 * When an app is launched, BIN will create a singleton object of Application(or subclass of Application), Thereafter you can access the object by bin.app.
		 * SPAApplication and WEBApplication are subclasses of Application. SPAApplication is aimed for Single-Page Application, WEBApplication is aimed for WEB Application(the traditional web development), and WEBApplication is used for MPAApplicaiton who is aimed for Multi-Page Applicaiton.
		 * 
		 * Application is inherit from Backbone.Events, so you can do some Observer-Pattern work on it.
		 * @class Application
		 * @see SPAApplication
		 * @see WEBApplication
		 * @see MPAApplication
		 * @see {@link http://backbonejs.org/|Backbone}
		 */
		var Application = function()
		{
			/**
			 * The singleton object of Application(or a subclass of Application)
			 * @memeberof bin
			 */
			bin.app = this;
		}

		Application.extend = bin.extend;

		var Class = Application.prototype;

		/**
		 * Initialize operation of application , such as creating netManager,dataCenter and mapManager. you can override it to do your application initialize work.
		 * NB: Don't forget to call parent init in your code.
		 * @memberof Application#
		 * @name init
		 * @type {Function}
		 */
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
			/**
			 * Singleton object of NetManager who do the whole http jobs. 
			 * @memberof Application#
			 * @name _netManager
			 * @type {NetManager}
			 * @see NetManager
			 */
			this._netManager = new bin.core.NetManager();
			this._netManager.init();

			/**
			 * Singleton object of DataCenter who do the data persistence jobs,such as session and local storage. 
			 * @memberof Application#
			 * @name _dataCenter
			 * @type {DataCenter}
			 * @see DataCenter
			 */
			this._dataCenter = new bin.core.DataCenter();
			this._dataCenter.init();

			/**
			 * The singleton object of NetManager
			 * @memberof bin
			 * @name netManager
			 * @type {NetManager}
			 */
			bin.netManager = this._netManager;
			/**
			 * The singleton object of DataCenter
			 * @memberof bin
			 * @name dataCenter
			 * @type {DataCenter}
			 */
			bin.dataCenter  = this._dataCenter;
			
			if(bin.globalConfig.mapSDK)
			{
				require(["bin/core/mapManager"], function(MapManager)
				{
					/**
					 * Singleton object of MapManager. 
					 * NB: Only available while mapSDK is set in globalConfig
					 * @memberof Application#
					 * @name _mapManager
					 * @type {MapManager}
					 * @see MapManager
					 */
					self._mapManager = new MapManager();
					self._mapManager.init();
					/**
					 * The singleton object of MapManager.
					 * NB: Only available while mapSDK is set in globalConfig
					 * @memberof bin
					 * @name mapManager
					 * @type {MapManager}
					 */
					bin.mapManager = self._mapManager;
				});
			}
		}

		/**
		 * Handler of window resizing event,the default job of the handler is fixing rem. 
		 * @memberof Application#
		 * @name onResize
		 * @type {Function}
		 */
		Class.onResize = function()
		{
			var elemRoot = document.documentElement;
			this._width  = elemRoot.clientWidth;
	        this._height = elemRoot.clientHeight; 

	        var standard = 320;
	        var unit     = 20;
	        if(bin.globalConfig.remConfig)
	        {
	        	if(bin.globalConfig.remConfig.unit)
	        	{
	        		unit = bin.globalConfig.remConfig.unit;
	        	}

	        	if(bin.globalConfig.remConfig.standard)
	        	{
	        		standard = bin.globalConfig.remConfig.standard;
	        	}
	        }
	        elemRoot.style.fontSize = this._width/standard*unit+"px";
		}

		/**
		 * Get the width of window.
		 * @memberof Application#
		 * @name width
		 * @type {Function}
		 */
		Class.width = function()
		{
			return this._width;
		}

		/**
		 * Get the height of window.
		 * @memberof Application#
		 * @name height
		 * @type {Function}
		 */
		Class.height = function()
		{
			return this._height;
		}

		/**
		 * Get the rem unit(px).
		 * @memberof Application#
		 * @name rem
		 * @type {Function}
		 */
		Class.rem = function()
		{
			return parseFloat(document.documentElement.style.fontSize);
		}

		/**
		 * Transform rem to px
		 * @memberof Application#
		 * @name rem2px
		 * @type {Function}
		 * @param {number} rem value in rem unit
		 */
		Class.rem2px = function(rem)
	    {
	    	return rem*this.rem();
	    }

	    /**
		 * Transform px to rem
		 * @memberof Application#
		 * @name px2rem
		 * @type {Function}
		 * @param {number} px value in px unit
		 */
	    Class.px2rem = function(px)
	    {
	    	return px/this.rem();
	    }

	    /**
		 * Get the width of client area. Default as width.
		 * @memberof Application#
		 * @name clientWidth
		 * @type {Function}
		 */
	    Class.clientWidth = function()
	    {
	    	return this.width();
	    }

	    /**
		 * Get the height of client area. Default as height.
		 * @memberof Application#
		 * @name clientHeight
		 * @type {Function}
		 */
		Class.clientHeight = function()
		{
			return this.height();
		}

		/**
		 * running operation of application, you'd better alwayse override it in SPA so that your application can launch from the right page.
		 * @memberof Application#
		 * @name run
		 * @type {Function}
		 */
		Class.run = function()
		{
			
		}

		/**
		 * release operation of application, you can override it do your release work.
		 * NB: Only available for SPA.
		 * @memberof Application#
		 * @name exit
		 * @type {Function}
		 */
		Class.exit = function()
		{
			
		}

		_.extend(Class, Backbone.Events);

		return Application;
	}
);
