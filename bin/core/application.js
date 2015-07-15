define([
		"underscore", 
		"backbone", 	
		"bin/common/extend",
		"bin/core/netManager", 
		"bin/core/navigationController", 
		"bin/core/debugManager",
		"bin/core/hudManager"
		], 
	function(_, Backbone, extend, NetManager, NavigationController, DebugManager, HUDManager)
	{
		var Application = function()
		{

		}

		Application.extend = extend;

		var Class = Application.prototype;

		Class.init = function()
		{
			this._debugManager = new DebugManager();
			this._debugManager.init();

			this._naviController = new NavigationController();
			this._naviController.init();

			this._netManager = new NetManager();
			this._netManager.init();

			this._hudManager = new HUDManager();
			this._hudManager.init();
			
			bin.app = this;
			bin.netManager = this._netManager;
			bin.naviController = this._naviController;
			bin.debugManager   = this._debugManager;
			bin.hudManager   = this._hudManager;

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