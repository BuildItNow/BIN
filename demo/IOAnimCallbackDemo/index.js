define(
	["common/demoView"],
	function(Base)
	{
		var Class = 
		{
			events:
			{
				"click #noCallback":"noCallback",
				"click #callback"  :"callback",	
				"click #netNoCallback":"netNoCallback",
				"click #netCallback"  :"netCallback",	
			}
		};

		Class.posGenHTML = function()
		{

		}

		Class.noCallback = function()
		{
			bin.naviController.push("IOAnimCallbackDemo/noCallback");
		}

		Class.callback = function()
		{
			bin.naviController.push("IOAnimCallbackDemo/callback");
		}

		Class.netNoCallback = function()
		{
			bin.naviController.push("IOAnimCallbackDemo/netNoCallback");
		}

		Class.netCallback = function()
		{
			bin.naviController.push("IOAnimCallbackDemo/netCallback");
		}

		return Base.extend(Class);
	} 
);