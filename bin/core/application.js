define([
		"bin/common/extend",
	  ], 
	function(extend)
	{
		var Application = function()
		{

		}

		Application.extend = extend;

		var Class = Application.prototype;

		Class.init = function()
		{
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
			
			bin.app = this;
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