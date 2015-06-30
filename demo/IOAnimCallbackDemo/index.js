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

		return Base.extend(Class);
	} 
);