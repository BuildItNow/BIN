define(
	["bin/core/naviPageView", "bin/util/osUtil"],
	function(Base, osUtil)
	{
		var Class = {};

		Class.events = 
		{
			"click #back" : "back",
			"click #jump" : "jump",
		};

		Class.onViewPush = function(pushFrom, pushData, queryParams)
		{
			bin.hudManager.alertInfo("数据 "+osUtil.dump(pushData)+" Query数据 "+osUtil.dump(queryParams), "从"+pushFrom+"跳转");
		}

		Class.back = function()
		{
			bin.naviController.pop(1, {a:10, b:{}, c:[]});
		}

		Class.jump = function()
		{
			bin.naviController.push("pageJumpParamsDemo/page1");
		}

		return Base.extend(Class);
	}
);