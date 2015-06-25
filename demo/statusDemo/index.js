define(
	["common/demoView", "bin/util/osUtil"],
	function(Base, osUtil)
	{
		var Class = {};

		Class.events = 
		{
			"click #showStatus" : "showStatus",
			"click #showStatus1" : "showStatus1",
		};

		Class.showStatus = function()
		{
			bin.hudManager.showStatus("Hello World");
		}

		Class.showStatus1 = function()
		{
			bin.hudManager.showStatus("BIN是一个轻量的Web APP框架，BIN的目的是让Web APP的开发像Native APP开发一样。BIN基于Cordova，支持Android和IOS平台");
		}

		return Base.extend(Class);
	} 
);