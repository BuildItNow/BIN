define(
	["common/demoView", "netDemo/client", "bin/util/osUtil"],
	function(Base, Client, osUtil)
	{
		var Class = {};

		Class.events = 
		{
			"click #sendRequest" : "sendRequest"
		};

		Class.sendRequest = function()
		{
			var self = this;
			Client.testAPI(function(data)
			{
				self.$text("#requestResult", osUtil.dump(data));
			})
		}

		return Base.extend(Class);
	}
);