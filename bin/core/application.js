define([
		"bin/core/view", "bin/util/osUtil"
	  ], 
	function(View, osUtil)
	{
		var Window = View.extend(
		{
			constructor:function(options)
			{
				bin.window = this;

				View.prototype.constructor.call(this, options);
			},
			posGenHTML:function()
			{
				this.$().css("position","absolute");
				this.$().css("overflow","hidden");
				this.$().css("display", "block");
                //this.$().css("transform", "scale(0.5)");
                //this.$().css("transform-origin", "top left");
					
				if(bin.globalConfig.width && bin.globalConfig.height)
				{
					if(bin.globalConfig.left)
					{
						this.$().css("left", bin.globalConfig.left+"px");
					}
					else
					{
						this.$().css("left", "0rem");
					}

					if(bin.globalConfig.top)
					{
						this.$().css("top", bin.globalConfig.top+"px");
					}
					else
					{
						this.$().css("top", "0rem");
					}
	
					this._width  = bin.globalConfig.width*2;
					this._height = bin.globalConfig.height*2;

					this.$().css("width", this._width + "px");
					this.$().css("height", this._height + "px");

                    this._fixed = true;
				}
                else
                {
                    this.$().css("left","0rem");
				    this.$().css("top","0rem");
                }
                
				var self = this;
				$(window).on('resize', function()
				{
					self._onResize();
				});
				this._onResize();
			},
			_onResize:function()
			{
				var elemRoot = document.documentElement;
                if(!this._fixed)
                {
                    //this._width  = elemRoot.clientWidth*2;
                    //this._height = elemRoot.clientHeight*2; 
                    
                    this._width  = elemRoot.clientWidth;
                    this._height = elemRoot.clientHeight; 
                    this.$().css("width", this._width+"px");
                    this.$().css("height", this._height+"px");
			    }		
                elemRoot.style.fontSize = this._width/640*40+"px";
				Backbone.trigger("DISPLAY_METRICS_CHANGED");
			},
			width:function()
			{
				return this._width;
			},
			height:function()
			{
				return this._height;
			},
			rem:function()
			{
				return parseFloat(document.documentElement.style.fontSize);
			}
		});

		var Application = function()
		{
			bin.app = this;
		}

		Application.extend = bin.extend;

		var Class = Application.prototype;

		Class.init = function()
		{
			this._window = new Window({elem:$("#window")});

			this._debugManager = new bin.core.DebugManager();
			this._debugManager.init();

			this._naviController = new bin.core.NavigationController();
			this._naviController.init();

			this._netManager = new bin.core.NetManager();
			this._netManager.init();

			this._hudManager = new bin.core.HUDManager();
			this._hudManager.init();

			this._dataCenter = new bin.core.DataCenter();
			this._dataCenter.init();

			this._nativeManager = new bin.core.NativeManager();
			this._nativeManager.init();
			
			bin.netManager = this._netManager;
			bin.naviController = this._naviController;
			bin.debugManager = this._debugManager;
			bin.hudManager  = this._hudManager;
			bin.dataCenter  = this._dataCenter;
			bin.nativeManager = this._nativeManager;

			var self = this;
			document.addEventListener("backbutton", function(){self.onDeviceBack()}, false);
			document.addEventListener("menubutton", function(){self.onDeviceMenu()}, false);
			document.addEventListener("searchbutton", function(){self.onDeviceSearch()}, false);
			document.addEventListener("pause", function(){self.onPause()}, false);
			document.addEventListener("resume", function(){self.onResume()}, false);
			document.addEventListener("hidekeyboard", function(){self.onHideKeyboard()}, false);
			document.addEventListener("showkeyboard", function(){self.onShowKeyboard()}, false);
		}

		Class.onDeviceBack = function()
		{
			console.info("onDeviceBack");

			if(this._hudManager.onDeviceBack())
			{
				return true;
			}				

			if(this._naviController.onDeviceBack())
			{
				return true;
			}

			return false;
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

		Class.run = function()
		{
			
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

		_.extend(Class, Backbone.Events);

		return Application;
	}
);
