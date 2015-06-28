define(
	["bin/core/naviPageView", "bin/util/osUtil"],
	function(Base, osUtil)
	{
		var Class = {};

		Class.events = 
		{
			"click #backTo" : "backTo",
			"click #backCount" : "backCount",
		};

		Class.backTo = function()
		{
			bin.naviController.popTo("welcome/index");
		}

		Class.backCount = function()
		{
			bin.naviController.pop(2, "Hello BIN Framework");
		}

		return Base.extend(Class);
	}
);