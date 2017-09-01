define([
		"bin/core/view", "fastclick", "bin/core/application"
	  ], 
	function(View, fastclick, Application)
	{
		fastclick.notNeeded = function(layer) 
		{
			'use strict';
			var metaViewport;
			var chromeVersion;

			// Devices that don't support touch don't need FastClick
			if (typeof window.ontouchstart === 'undefined') 
			{
				return true;
			}

			// Chrome version - zero for other browsers
			chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

			if (chromeVersion) 
			{
				if (deviceIsAndroid) 
				{
					metaViewport = document.querySelector('meta[name=viewport]');

					if (metaViewport)
					{
						// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
						if (metaViewport.content.indexOf('user-scalable=no') !== -1) 
						{
							//patch here
							return false;
						}
						// Chrome 32 and above with width=device-width or less don't need FastClick
						if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) 
						{
							//patch here
							return false;
						}
					}

					// Chrome desktop doesn't need FastClick (issue #15)
				} 
				else 
				{
					//patch here
					return false;
				}
			}

			// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
			if (layer.style.msTouchAction === 'none') 
			{
				return true;
			}

			return false;
		};

		/**
		 * The SPA(Single-Page Application) base applicaiton class. 
		 * @class SPAApplication
		 * @see Application
		 */
		var Class = {};

		Class.init = function()
		{
			fastclick.attach(document.body);
			
			this.fixWindow();

			Application.prototype.init.apply(this);

			if(bin.runtimeConfig.debug)
	        {
	        	require(["bin/core/debugManager"], function(DebugManager)
				{
					self._debugManager = new DebugManager();
					self._debugManager.init();

					bin.debugManager = self._debugManager;
				});
			}

			this._naviController = new bin.core.NavigationController();
			this._naviController.init();

			this._hudManager = new bin.core.HUDManager();
			this._hudManager.init();

			bin.naviController = this._naviController;
			bin.hudManager  = this._hudManager;

			var self = this;
			document.addEventListener("backbutton", function(){self.onDeviceBack()}, false);
			document.addEventListener("menubutton", function(){self.onDeviceMenu()}, false);
			document.addEventListener("searchbutton", function(){self.onDeviceSearch()}, false);
			document.addEventListener("pause", function(){self.onPause()}, false);
			document.addEventListener("resume", function(){self.onResume()}, false);
			document.addEventListener("hidekeyboard", function(){self.onHideKeyboard()}, false);
			document.addEventListener("showkeyboard", function(){self.onShowKeyboard()}, false);
		
			if(this.appBootBg && !this.appBootBg.time)
			{
				this.appBootBg.time = bin.globalConfig.appBootBgTime;
			}
		}

		Class.fixWindow = function()
		{
			this._elemWindow = $("#window");
			var elemWindow = this._elemWindow;

			elemWindow.css("position","absolute");
			elemWindow.css("overflow","hidden");
			elemWindow.css("display", "block");
            //this.$().css("transform", "scale(0.5)");
            //this.$().css("transform-origin", "top left");
					
			if(bin.globalConfig.width && bin.globalConfig.height)
			{
				if(bin.globalConfig.left)
				{
					elemWindow.css("left", bin.globalConfig.left+"px");
				}
				else
				{
					elemWindow.css("left", "0rem");
				}

				if(bin.globalConfig.top)
				{
					elemWindow.css("top", bin.globalConfig.top+"px");
				}
				else
				{
					elemWindow.css("top", "0rem");
				}

				if(bin.globalConfig.width === "fixed" || bin.globalConfig.height === "fixed")
				{
					var elemRoot = document.documentElement;
					this._width  = elemRoot.clientWidth;
                   	this._height = elemRoot.clientHeight;
				}
				else
				{
					this._width  = bin.globalConfig.width;//*2;
					this._height = bin.globalConfig.height;//*2;
				}

				elemWindow.css("width", this._width + "px");
				elemWindow.css("height", this._height + "px");

                this._fixed = true;
			}
            else
            {
                elemWindow.css("left","0rem");
			    elemWindow.css("top","0rem");
            }
		}

		Class.onResize = function()
		{
			var elemRoot = document.documentElement;
            if(!this._fixed)
            {
                //this._width  = elemRoot.clientWidth*2;
                //this._height = elemRoot.clientHeight*2; 
                
                this._width  = elemRoot.clientWidth;
                this._height = elemRoot.clientHeight; 
                this._elemWindow.css("width", this._width+"px");
                this._elemWindow.css("height", this._height+"px");
			}	

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
	        
			setTimeout(function(){Backbone.trigger("DISPLAY_METRICS_CHANGED");});
		}

		Class.onDeviceBack = function()
		{
			if(this._hudManager.onDeviceBack())
			{
				return true;
			}				

			if(this._naviController.onDeviceBack())
			{
				return true;
			}

			var self = this;

			bin.hudManager.alert
			({
				message:{text:"确定退出程序?"},
				buttons:
				[
					{text:"确定", onClick:function(v)
					{
						v.close(); 
						self.exit();
					}},
					{text:"取消", onClick:function(v){v.close()}},	
				]
			});

			return true;
		}

		Class.onDeviceMenu = function()
		{
			console.info("onDeviceMenu");
		}

		Class.onDeviceSearch = function()
		{
			console.info("onDeviceSearch");
		}

		Class.onPause = function()
		{
			console.info("onPause");
		}

		Class.onResume = function()
		{
			console.info("onResume");
		}

		Class.onShowKeyboard = function()
		{
			console.info("onShowKeyboard");
		}

		Class.onHideKeyboard = function()
		{
			console.info("onHideKeyboard");
		}

		Class.exit = function()
		{
			setTimeout(function()
			{
				navigator.app.exitApp();
			}, 100);
		}

		Class.navHeight = function()
		{
			return this.rem2px(2.2);
		}

		Class.navClientHeight = function()
		{
			return this.clientHeight()-this.navHeight();
		}

		Class.fireReady = function()
		{
			if(cordova && cordova.binPlugins && cordova.binPlugins.eventEmiter)
			{
				setTimeout(function()
				{
					cordova.binPlugins.eventEmiter.fire("SCRIPT_EVENT_READY");
				}, 0);
			}
		}

		return Application.extend(Class);
	}
);
