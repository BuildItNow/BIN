define([
		"bin/core/view", "bin/util/osUtil", "bin/util/fastclickUtil", "bin/core/application"
	  ], 
	function(View, osUtil, fastclickUtil, Application)
	{
		var Class = {};

		Class.init = function()
		{
			fastclickUtil.attach(document.body);
			
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
			
			if(cordova)
			{
				this._nativeManager = new bin.core.NativeManager();
				this._nativeManager.init();
				bin.nativeManager = this._nativeManager;
			}

			var self = this;
			document.addEventListener("backbutton", function(){self.onDeviceBack()}, false);
			document.addEventListener("menubutton", function(){self.onDeviceMenu()}, false);
			document.addEventListener("searchbutton", function(){self.onDeviceSearch()}, false);
			document.addEventListener("pause", function(){self.onPause()}, false);
			document.addEventListener("resume", function(){self.onResume()}, false);
			document.addEventListener("hidekeyboard", function(){self.onHideKeyboard()}, false);
			document.addEventListener("showkeyboard", function(){self.onShowKeyboard()}, false);
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
            elemRoot.style.fontSize = this._width/640*40+"px";
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
			osUtil.delayCall(function()
			{
				navigator.app.exitApp();
			}, 100);
		}

		Class.fireReady = function()
		{
			osUtil.nextTick(function()
			{
				if(cordova)
				{
					cordova.binPlugins.eventEmiter.fire("SCRIPT_EVENT_READY");
				}
			});
		}

		return Application.extend(Class);
	}
);
