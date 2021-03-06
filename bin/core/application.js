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

			if(bin.core.Router)
            {
                this._router = new bin.core.Router();
                this._router.init();

                bin.router = this._router;
            }

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

			var elem = $("#appBootBg");
			if(elem.length > 0)
			{
				var appBootBg  = {elem:elem};
				appBootBg.init = function()
				{
					this.elem.attr("v-pre", "");
					if(document.body.className.indexOf(" app-boot") < 0)
					{
						document.body.className += " app-boot";
					}

					this.time = this.elem.attr("time");
					this.effect = this.elem.attr("effect");

					if(this.effect === "fade")
					{
						this.elem.css({
							opacity: "1",
							transition: "opacity 0.3s ease-out"
						})
					}
				}

				appBootBg.dismiss = function()
				{
					if(this.effect === "fade")
					{
						this.effect = "";
						this.elem.css("opacity", 0);

						var self = this;
						setTimeout(function()
						{
							self.dismiss();
						}, 300);

						return ;
					}

					if(document.body.className.indexOf(" app-boot") >= 0)
					{
						document.body.className = document.body.className.replace(" app-boot", "");
					}

					this.elem.remove();

					delete bin.app.appBootBg;
				}

				appBootBg.init();

				this.appBootBg = appBootBg;
			}
		}

		/**
		 * running operation of application, you'd better alwayse override it in SPA so that your application can launch from the right page.
		 * @memberof Application#
		 * @name run
		 * @type {Function}
		 */
		Class.run = function()
		{
			var BodyView = bin.ui.BodyView;
			if(typeof page !== "undefined" && page.BodyView)
			{
				BodyView = page.BodyView;
			}
			
			if(!BodyView)
			{
				BodyView = bin.ui.View.extend({});
			}

			document.body.setAttribute("vm", "");
			this.bodyView = BodyView.create({elem:$("body")});

			if(this.appBootBg)
			{
				var appBootBg = this.appBootBg;
				var time = appBootBg.time;
				if(!time)
				{
					appBootBg.dismiss();
				}
				else if(time === "custom")
				{
					return ;
				}
				else if(time.startsWith("delay"))
				{
					time = parseInt(time.substring(5)) || 100;
					setTimeout(function()
					{
						appBootBg.dismiss();
					}, time);
				}
				else
				{
					time = parseInt(time)-(_.now()-__bin__start__time);
					if(time<50)
					{
						appBootBg.dismiss();
					}
					else
					{
						setTimeout(function()
						{
							appBootBg.dismiss();
						}, time);
					}
				}
			}
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

		_.extend(Class, Backbone.Events);

		return Application;
	}
);
