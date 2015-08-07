define([
		"bin/common/extend", "bin/core/view"
	  ], 
	function(extend, View)
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
					

					this.$().css("width", bin.globalConfig.width + "px");
					this.$().css("height", bin.globalConfig.height + "px");

					this._width  = bin.globalConfig.width;
					this._height = bin.globalConfig.height;
				}
				else
				{
					this.$().css("left","0rem");
					this.$().css("right","0rem");
					this.$().css("top","0rem");
					this.$().css("bottom","0rem");
				}

				this._resetFontSize();
				var self = this;
				$(window).on('resize', function()
				{
					self._resetFontSize();
				});
			},
			_resetFontSize:function()
			{
				var elemRoot = document.documentElement;
				var w = this._width || elemRoot.clientWidth;
			    if (!w) return;
				elemRoot.style.fontSize = 20 * (w / 320) + 'px';

				Backbone.trigger("DISPLAY_METRICS_CHANGED");
			},
			width:function()
			{
				return this._width || document.documentElement.clientWidth;
			},
			height:function()
			{
				return this._height || document.documentElement.clientHeight;
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

		Application.extend = extend;

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
			
			bin.netManager = this._netManager;
			bin.naviController = this._naviController;
			bin.debugManager = this._debugManager;
			bin.hudManager  = this._hudManager;
			bin.dataCenter  = this._dataCenter;

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

		_.extend(Class, Backbone.Events);

		return Application;
	}
);