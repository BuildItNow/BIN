define(
	["common/demoView"],
	function(Base)
	{
		var Class = {};

		Class.events = 
		{
			"click #noIO" : "noIO",
			"click #fadeIO" : "fadeIO",
			"click #rightIO" : "rightIO",
			"click #rightILeftO" : "rightILeftO",
		}

		Class.noIO = function()
		{
			bin.naviController.push("pageJumpDemo/page0", null, {effect:"noIO"});
		}

		Class.fadeIO = function()
		{
			bin.naviController.push("pageJumpDemo/page0", null, {effect:"fadeIO"});
		}

		Class.rightIO = function()
		{
			bin.naviController.push("pageJumpDemo/page0", null, {effect:"rightIO"});
		}

		Class.rightILeftO = function()
		{
			bin.naviController.push("pageJumpDemo/page0", null, {effect:"rightILeftO"});
		}

		return Base.extend(Class);
	}
);