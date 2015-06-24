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
			
			window.changanBackbutton = function() 
			{
				if(!bin.app)
				{
					return ;
				}

				bin.app.onDeviceBack();
			};
			document.addEventListener("backbutton", window.changanBackbutton, false);

			bin.app = this;
			bin.netManager = this._netManager;
			bin.naviController = this._naviController;
			bin.debugManager   = this._debugManager;
			bin.hudManager   = this._hudManager;
		}

		Class.onDeviceBack = function()
		{
			if(this._navigationController && this._navigationController.onDeviceBack())
			{
				return ;
			}
		}

		Class.run = function()
		{
			
		}

		_.extend(Class, Backbone.Events);

		return Application;
	}
);